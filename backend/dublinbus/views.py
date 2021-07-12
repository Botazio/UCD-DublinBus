from datetime import datetime, timedelta, timezone
from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.contrib.auth import get_user_model

from dublinbus.models import Route, Stop, Trip, StopTime
import dublinbus.utils as utils

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializerWithToken, \
    FavouriteStopSerializer, \
    FavouriteJourneySerializer
from .models import FavouriteStop, FavouriteJourney
from .permissions import IsOwner, IsUser

def index(request):
    """Temporary homepage for the application"""
    return render(request, 'dublinbus/index.html')

def stops(request):
    """Returns a list of dictionaries of all the bus stops in Dublin Bus."""

    stops_list = list(Stop.objects.values())
    for stop_detail in stops_list:
        stop_detail['stop_lines'] = list(Stop.objects.get(stop_id=stop_detail['stop_id'])  \
                                           .line_set.all().values_list('line', flat=True))

    return JsonResponse(stops_list, safe=False)

def stop(request, stop_id):
    """Returns all of the scheduled arrivals for a particular stop within the next hour and
    any delays to those schedules from the real-time data."""

    try:
        stop_details = Stop.objects.get(stop_id=stop_id)
    except Stop.DoesNotExist as stop_not_exist:
        raise Http404("Invalid Stop ID") from stop_not_exist

    result = {
        'stop_name': stop_details.stop_name,
        'stop_lat': stop_details.stop_lat,
        'stop_lon': stop_details.stop_lon,
        'arrivals': []
    }

    # Timezone aware current time
    current_date = datetime.now(timezone(timedelta(hours=1)))

    stop_time_details = StopTime.objects.filter(
        stop_id=stop_id,
        # Get all arrival times in the next hour
        arrival_time__gte=current_date.time(),
        arrival_time__lte=(current_date + timedelta(hours=1)).time()
    )

    # Get realtime data from NTA API
    realtime_updates = utils.request_realtime_nta_data()

    for stop_time in stop_time_details:

        # Only get details for trips that operate on the current day
        if stop_time.trip.calendar.service_id in utils.date_to_service_ids(current_date):

            delay = utils.get_realtime_dublin_bus_delay(realtime_updates,
                                                    stop_time.trip.trip_id,
                                                    stop_time.stop_sequence)

            result['arrivals'].append({
                'route_id': stop_time.trip.route.route_id,
                'trip_id': stop_time.trip.trip_id,
                'direction': stop_time.trip.direction_id,
                'final_destination_stop_name': StopTime.objects \
                                            .filter(trip_id=stop_time.trip.trip_id) \
                                            .order_by('-stop_sequence')[:1] \
                                            .first().stop.stop_name,
                'line': stop_time.trip.route.route_short_name,
                'service_id': stop_time.trip.calendar.service_id,
                'scheduled_arrival_time': stop_time.arrival_time,
                'scheduled_departure_time': stop_time.departure_time,
                'stop_sequence': stop_time.stop_sequence,
                'delay_sec': delay,
                'due_in_min': utils.get_due_in_time(current_date, stop_time.arrival_time, delay)
            })

    result['arrivals'] = sorted(result['arrivals'],
                                key=lambda arrival: arrival['scheduled_arrival_time'])
    return JsonResponse(result)

def route(request, route_id):
    """Returns all of the trips for a particular route."""

    route_details = Route.objects.get(route_id=route_id)
    trips = Trip.objects.filter(route_id=route_id)

    trips_simple = []
    for trip in trips:
        trip_output = {}
        trip_output['trip_id'] = trip.trip_id
        trip_output['stops'] = []

        stop_times = StopTime.objects.filter(trip_id=trip.trip_id)
        for stop_time in stop_times:
            trip_output['stops'].append({
                'stop_id': stop_time.stop_id,
                'arrival_time': stop_time.arrival_time,
                'departure_time': stop_time.departure_time,
                'stop_sequence': stop_time.stop_sequence
            })
        trips_simple.append(trip_output)

    response = {
        'route_id': route_id,
        'route_name': route_details.route_short_name,
        'trips': trips_simple
    }

    return JsonResponse(response)

def predict(request):
    """
    Predict travel time in seconds between two stops on the same route/trip.
    These stops do not need to necessarily be adjacent.

    Takes three query parameters: trip_id, depature_stop_id and arrival_stop_id

    Example:

    /dublinbus/predict?trip_id=<trip_A>&departure_stop_id=<stop_A>&arrival_stop_id=<stop_B>
    """

    trip_id = request.GET["trip_id"]
    departure_stop_id = request.GET["departure_stop_id"]
    arrival_stop_id = request.GET["arrival_stop_id"]

    departure_stop_sequence = StopTime.objects.filter(
        trip_id=trip_id, stop_id=departure_stop_id)[0].stop_sequence
    arrival_stop_sequence = StopTime.objects.filter(
        trip_id=trip_id, stop_id=arrival_stop_id)[0].stop_sequence

    total_time = 0
    for stop_sequence in range(departure_stop_sequence, arrival_stop_sequence):
        departure_stop = StopTime.objects.get(
            trip_id=trip_id, stop_sequence=stop_sequence).stop_id
        arrival_stop = StopTime.objects.get(
            trip_id=trip_id, stop_sequence=stop_sequence + 1).stop_id

        departure_stop_num = Stop.objects.get(stop_id=departure_stop).stop_num
        arrival_stop_num = Stop.objects.get(stop_id=arrival_stop).stop_num

        try:
            total_time += utils.predict_adjacent_stop(
                departure_stop_num, arrival_stop_num)
        except KeyError as exc:
            raise Http404(
                f"Cannot find a prediction from {departure_stop_num} to {arrival_stop_num}"
                ) from exc

    return JsonResponse({"prediction": total_time})

class FavouriteStopView(APIView):
    """
    Get, Post or Delete a FavouriteStop instance(s) for the currently authenticated user.
    """

    permission_classes = [IsOwner]

    def get(self, request):
        """Return a list of all the FavouriteStops for the currently authenticated user."""
        favourite_stops = FavouriteStop.objects.filter(owner=self.request.user)
        serializer = FavouriteStopSerializer(favourite_stops, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new FavouriteStop for the currently authenticated user."""
        serializer = FavouriteStopSerializer(data=request.data)
        if serializer.is_valid():
            # Associating the user that created the FavouriteStop, with the FavouriteStop instance
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def get_object(primary_key):
        """Return the FavouriteStop object for the currently authenticated user."""
        try:
            return FavouriteStop.objects.get(pk=primary_key)
        except FavouriteStop.DoesNotExist as favourite_stop_not_exist:
            raise Http404(f"Cannot find FavouriteStop: {primary_key}") from favourite_stop_not_exist
                
    def delete(self, request, primary_key):
        """Delete a FavouriteStop for the currently authenticated user."""
        favourite_stop = self.get_object(primary_key)
        self.check_object_permissions(self.request, favourite_stop)
        favourite_stop.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FavouriteJourneyView(APIView):
    """
    Get, Post or Delete a FavouriteJourney instance(s) for the currently authenticated user.
    """

    permission_classes = [IsOwner]

    def get(self, request):
        """Return a list of all the FavouriteJourneys for the currently authenticated user."""
        favourite_journeys = FavouriteJourney.objects.filter(owner=self.request.user)
        serializer = FavouriteJourneySerializer(favourite_journeys, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new FavouriteJourney for the currently authenticated user."""
        serializer = FavouriteJourneySerializer(data=request.data)
        if serializer.is_valid():
            # Associating the user that created the FavouriteStop, with the FavouriteStop instance
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def get_object(primary_key):
        """Return the FavouriteJourneys object for the currently authenticated user."""
        try:
            return FavouriteJourney.objects.get(pk=primary_key)
        except FavouriteJourney.DoesNotExist as favourite_journey_not_exist:
            raise Http404(f"Cannot find FavouriteJourney: {primary_key}") from favourite_journey_not_exist

    def delete(self, request, primary_key):
        """Delete a FavouriteJourney for the currently authenticated user."""
        favourite_journey = self.get_object(primary_key)
        self.check_object_permissions(self.request, favourite_journey)
        favourite_journey.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserView(APIView):
    """
    Get, Post or Delete a User instance.
    """

    permission_classes = [IsUser]   # [ IsUser | IsAdminUser ]

    def get(self, request):
        """Return the User details for the currently authenticated user."""
        serializer = UserSerializerWithToken(request.user)
        return Response(serializer.data)

    def post(self, request):
        """Create a new User for the currently authenticated user."""
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def get_object(primary_key):
        """Return the User object for the currently authenticated user."""
        try:
            return get_user_model().objects.get(pk=primary_key)
        except get_user_model().DoesNotExist as user_not_exist:
            raise Http404(f"Cannot find User: {primary_key}") from user_not_exist

    def delete(self, request, primary_key):
        """Delete a User for the currently authenticated user."""
        user = self.get_object(primary_key)
        self.check_object_permissions(self.request, user)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        