import math
from datetime import datetime, timedelta, timezone
from dateutil import tz
from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.contrib.auth import get_user_model
import numpy as np

from dublinbus.models import Route, Stop, Trip, StopTime
import dublinbus.utils as utils

from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import UserSerializerWithToken, \
    FavoriteStopSerializer, \
    FavoriteJourneySerializer, \
    MarkerSerializer, \
    ThemeSerializer, \
    UserSerializer
from .models import FavoriteStop, FavoriteJourney, Marker, Theme
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

class Predict(APIView):
    """
    Predict travel time in seconds between two stops on the same route/trip.
    These stops do not need to necessarily be adjacent.

    Takes three query parameters: trip_id, depature_stop_id and arrival_stop_id

    Example:

    /dublinbus/predict?trip_id=<trip_A>&departure_stop_id=<stop_A>&arrival_stop_id=<stop_B>
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Route for requesting a bus journey time prediction between stops.

        This route accepts POST requests with the following parameters:

            route_id: str
                The route ID of the journey

            departure_stop_id: str
                The stop ID of the departure stop in the journey

            arrival_stop_id: str
                The stop ID of the departure stop in the journey

            datetime: datetime str
                The datetime for the prediction. This should be a date in the
                future. Example format: 07/28/2021, 20:35:14

            num_predictions: int (optional)
                The number of requested predictions

            Python Example:

                import requests

                data = {
                    "route_id": "60-39A-b12-1",
                    "departure_stop_id": "8250DB000767",
                    "arrival_stop_id": "8250DB000768",
                    "datetime": "07/28/2021, 20:35:14"
                }

                r = requests.post(
                    'http://52.207.217.126/predict/',
                    data = data
                )

        The route returns an array of predictions of the journey time

        """

        parsed_datetime = datetime.strptime(
            request.data["datetime"],
            "%m/%d/%Y, %H:%M:%S"
        ).replace(tzinfo=tz.gettz('Europe/London'))

        weather_forecast = utils.get_weather_forecast(parsed_datetime)

        midnight = datetime(
                            year=parsed_datetime.year,
                            month=parsed_datetime.month,
                            day=parsed_datetime.day
                    ).replace(tzinfo=tz.gettz('Europe/London'))
        seconds_since_midnight = (parsed_datetime - midnight).total_seconds()

        features = {
            'cos_time': math.cos(seconds_since_midnight),
            'sin_time': math.sin(seconds_since_midnight),
            'cos_day': math.cos(parsed_datetime.weekday()),
            'sin_day': math.sin(parsed_datetime.weekday()),
            'rain': weather_forecast['rain'],
            'lagged_rain': weather_forecast['lagged_rain'],
            'temp': weather_forecast['temp'],
            'bank_holiday': utils.check_bank_holiday(parsed_datetime)
        }

        trip_id = Trip.objects.filter(
            route=request.data['route_id']
        ).values_list('trip_id', flat=True)[1]

        departure_stop_sequence = StopTime.objects.filter(
            trip_id=trip_id, stop_id=request.data['departure_stop_id'])[0].stop_sequence
        arrival_stop_sequence = StopTime.objects.filter(
            trip_id=trip_id, stop_id=request.data['arrival_stop_id'])[0].stop_sequence

        # Array of predictions for the journey
        total_times = np.zeros(int(request.data.get('num_predictions', 100)))

        for stop_sequence in range(departure_stop_sequence, arrival_stop_sequence):
            departure_stop = StopTime.objects.get(
                trip_id=trip_id, stop_sequence=stop_sequence).stop_id
            arrival_stop = StopTime.objects.get(
                trip_id=trip_id, stop_sequence=stop_sequence + 1).stop_id

            stop_pair_time_predictions = utils.predict_adjacent_stop(
                Stop.objects.get(stop_id=departure_stop).stop_num,
                Stop.objects.get(stop_id=arrival_stop).stop_num,
                features,
                num_predictions=int(request.data.get('num_predictions', 100))
            )

            # Add predictions for current adjacent stop pair to
            # total journey prediction
            total_times += stop_pair_time_predictions

        return Response({"prediction": total_times.tolist()}, status=status.HTTP_200_OK)


class FavoriteStopView(APIView):
    """
    Get, Post or Delete a FavoriteStop instance(s) for the currently authenticated user.
    """

    permission_classes = [IsOwner]

    def get(self, request):
        """Return a list of all the FavoriteStops for the currently authenticated user."""
        favorite_stops = FavoriteStop.objects.filter(owner=self.request.user)
        serializer = FavoriteStopSerializer(favorite_stops, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new FavoriteStop for the currently authenticated user."""
        serializer = FavoriteStopSerializer(data=request.data)
        if serializer.is_valid():
            # Associating the user that created the FavoriteStop, with the FavoriteStop instance
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def get_object(primary_key):
        """Return the FavoriteStop object for the currently authenticated user."""
        try:
            return FavoriteStop.objects.get(pk=primary_key)
        except FavoriteStop.DoesNotExist as favorite_stop_not_exist:
            raise Http404(f"Cannot find FavoriteStop: {primary_key}") from favorite_stop_not_exist

    def delete(self, request, primary_key):
        """Delete a FavoriteStop for the currently authenticated user."""
        favorite_stop = self.get_object(primary_key)
        self.check_object_permissions(self.request, favorite_stop)
        favorite_stop.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FavoriteJourneyView(APIView):
    """
    Get, Post or Delete a FavoriteJourney instance(s) for the currently authenticated user.
    """

    permission_classes = [IsOwner]

    def get(self, request):
        """Return a list of all the FavoriteJourneys for the currently authenticated user."""
        favorite_journeys = FavoriteJourney.objects.filter(owner=self.request.user)
        serializer = FavoriteJourneySerializer(favorite_journeys, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new FavoriteJourney for the currently authenticated user."""
        serializer = FavoriteJourneySerializer(data=request.data)
        if serializer.is_valid():
            # Associating the user that created the FavoriteStop, with the FavoriteStop instance
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def get_object(primary_key):
        """Return the FavoriteJourneys object for the currently authenticated user."""
        try:
            return FavoriteJourney.objects.get(pk=primary_key)
        except FavoriteJourney.DoesNotExist as favorite_journey_not_exist:
            raise Http404(
                f"Cannot find FavoriteJourney: {primary_key}"
                ) from favorite_journey_not_exist

    def delete(self, request, primary_key):
        """Delete a FavoriteJourney for the currently authenticated user."""
        favorite_journey = self.get_object(primary_key)
        self.check_object_permissions(self.request, favorite_journey)
        favorite_journey.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserView(APIView):
    """
    Get, Post or Delete a User instance.
    """

    permission_classes = [IsUser]   # [ IsUser | IsAdminUser ]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request):
        """Return the User details for the currently authenticated user."""
        serializer = UserSerializer(request.user)
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
        
    def put(self, request, primary_key):
        """ Update User fields for the currently authenticated user. """
        user = self.get_object(primary_key)
        serializer = UserSerializerWithToken(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class MarkerView(APIView):
    """
    Get or Put a Marker instance.
    """
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        """Return the Markers for the currently authenticated user."""
        markers = Marker.objects.filter(owner=self.request.user.id)
        serializer = MarkerSerializer(markers, many=True)
        return Response(serializer.data)

    def get_object(self, pk):
        """Return the Marker object for the currently authenticated user."""
        try:
            return Marker.objects.get(pk=pk)
        except Marker.DoesNotExist:
            raise Http404
   
    def put(self, request, primary_key):
        """ Update Marker fields for the currently authenticated user. """
        marker = self.get_object(primary_key)
        serializer = MarkerSerializer(marker, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ThemeView(APIView):
    """
    Get or Put a Theme instance.
    """
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        """Return the Theme for the currently authenticated user."""
        themes = Theme.objects.filter(owner=self.request.user.id)
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data)

    def get_object(self, pk):
        """Return the Theme object for the currently authenticated user."""
        try:
            return Theme.objects.get(pk=pk)
        except Theme.DoesNotExist:
            raise Http404

    def put(self, request, primary_key):
        """ Update Theme fields for the currently authenticated user. """
        theme = self.get_object(primary_key)
        serializer = ThemeSerializer(theme, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

