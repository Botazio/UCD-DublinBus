import math
import logging
from datetime import datetime, timedelta, timezone
from dateutil import tz
from django.db.models import F
from django.shortcuts import render
from django.http import JsonResponse, Http404, HttpResponseBadRequest, HttpResponse
from django.contrib.auth import get_user_model
from django.views.decorators.cache import cache_page
import numpy as np

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.generics import GenericAPIView

import dublinbus.utils as utils
from dublinbus.models import Route, Stop, Trip, StopTime, Calendar, Shape, \
    FavoriteStop, FavoriteJourney, FavoriteLine, Marker, Theme, \
    FeedbackQuestion
from .serializers import UserSerializerWithToken, \
    FavoriteStopSerializer, \
    FavoriteJourneySerializer, \
    FavoriteLineSerializer, \
    MarkerSerializer, \
    ThemeSerializer, \
    UserSerializer, \
    ChangePasswordSerializer, \
    GoogleSocialAuthSerializer, \
    FacebookSocialAuthSerializer, \
    FeedbackAnswerSerializer, FeedbackQuestionSerializer
from .permissions import IsOwner, IsUser

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Get an instance of a logger
logger = logging.getLogger(__name__)

def index(request):
    """Temporary homepage for the application"""
    return render(request, 'dublinbus/index.html')

def privacy_policy(request):
    """Privacy Policy"""
    return render(request, 'dublinbus/privacy_policy.html')

def data_deletion(request):
    """Data Deletion instructions"""
    return render(request, 'dublinbus/data_deletion.html')

@cache_page(60 * 60)
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

@cache_page(60 * 60)
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

def lines(request):
    """
    Get all of the lines in both directions for the bus network
    """

    # Get valid service IDs (current date is greater than start_date and
    # less than end date)
    day = datetime.today().strftime("%A").lower()
    service_ids = list(Calendar.objects
                       .filter(**{day: True})
                        .filter(
                            start_date__lte=datetime.today(),
                            end_date__gte=datetime.today()
                        )
                        .values_list('service_id', flat=True)
                    )

    result = Trip.objects.filter(
                            calendar_id__in=service_ids
                        ).values(
                            "route_id", "direction_id", "trip_headsign",
                            "route__route_short_name"
                        ).distinct()

    for i, record in enumerate(result):
        # make list of all possible trip_ids for this route & direction
        trid_ids = \
            Trip.objects.filter(route_id=record['route_id'],
                            direction_id=record['direction_id'],
                            trip_headsign=record['trip_headsign'],
                            route__route_short_name=record['route__route_short_name']
                            ).values_list("trip_id", flat=True)

        # append the upcoming or most recently past trip_id for this route & direction
        trip_id = \
            StopTime.objects.order_by("departure_time")\
                            .filter(trip_id__in=trid_ids,
                                    shape_dist_traveled="0.00",
                                    departure_time__gte=datetime.now())\
                            .values_list("trip_id",flat=True)

        # if there are no more services for this trip today
        if not trip_id:
            # then append the most recent past trip
            result[i]['trip_id'] = \
                StopTime.objects.order_by("-departure_time")\
                                .filter(trip_id__in=trid_ids,
                                        shape_dist_traveled="0.00")\
                                .values_list("trip_id", flat=True)[0]
        else:
            # otherwise append the most recent future trip
            result[i]['trip_id'] = trip_id[0]

        # append stops list per route & direction
        result[i]['stops'] = list(
            StopTime.objects.filter(trip_id=record['trip_id']
                                    ).values("arrival_time",
                                             "departure_time",
                                             "stop_sequence",
                                             "stop_headsign",
                                             "shape_dist_traveled",
                                             "stop_id",
                                             stop_name=F("stop__stop_name"),
                                             stop_num=F("stop__stop_num"),
                                             stop_lat=F("stop__stop_lat"),
                                             stop_lon=F("stop__stop_lon")
                                             )
                                    )

    return JsonResponse(list(result), safe=False)

@cache_page(60 * 60)
def stops_by_trip(request, trip_id):
    """Returns the stops in a trip in order of stop sequence."""

    try:
        result = StopTime.objects.filter(trip_id=trip_id
                                         ).values("arrival_time",
                                                  "departure_time",
                                                  "stop_sequence",
                                                  "stop_headsign",
                                                  "shape_dist_traveled",
                                                  "stop_id",
                                                  stop_name=F("stop__stop_name"),
                                                  stop_num=F("stop__stop_num"),
                                                  stop_lat=F("stop__stop_lat"),
                                                  stop_lon=F("stop__stop_lon")
                                                  ).order_by('stop_sequence')
    except Trip.DoesNotExist as trip_not_exist:
        raise Http404("Invalid Trip ID") from trip_not_exist

    return JsonResponse(list(result), safe=False)

@cache_page(60 * 60)
def shape_by_trip(request, trip_id):
    """Returns the shape of a trip in order of point sequence."""

    try:
        # get the shape_id associated with selected trip_id
        shape_id = Trip.objects.get(trip_id=trip_id).shape_id
    except Trip.DoesNotExist as trip_not_exist:
        raise Http404("Invalid Trip ID") from trip_not_exist

    try:
        result = Shape.objects.filter(shape_id=shape_id
                                      ).values().order_by('shape_pt_sequence')
    except Shape.DoesNotExist as shape_not_exist:
        raise Http404("Invalid Shape ID") from shape_not_exist

    return JsonResponse(list(result), safe=False)

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

            direction_id: int
                The direction ID of the journey

            departure_stop_id: str
                The stop ID of the departure stop in the journey

            arrival_stop_id: str
                The stop ID of the departure stop in the journey

            datetime: datetime str
                The datetime for the prediction. This should be a date in the
                future. Example format: 07/28/2021, 20:35:14

            Python Example:

                import requests

                data = {
                    "route_id": "60-39A-b12-1",
                    "direction_id": "1",
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

        current_date = datetime.now().replace(tzinfo=tz.gettz('Europe/London'))
        if parsed_datetime <= current_date or \
            parsed_datetime >= current_date + timedelta(days=7):
            return HttpResponseBadRequest("Requested date must be within the next 7 days")

        weather_forecast = utils.get_weather_forecast(parsed_datetime)

        # Could not find any matches in hourly or daily forecasts
        if len(weather_forecast) == 0:
            return HttpResponseBadRequest(
                    f"Could not get weather forecast for {parsed_datetime}"
                )

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

        # Get a list of trip IDs and associated stop times that are valid
        # for this particular day on this route in this direction. We are
        # assuming that the sequence of stops is the same for all these trips so
        # just use the first
        trip_ids = Trip.objects.filter(
            route=request.data['route_id'],
            direction_id=request.data['direction_id'],
            # Get the service IDs that are valid for the date
            calendar_id__in=utils.date_to_service_ids(parsed_datetime)
        ).values(
            'trip_id', 'stoptime', 'stoptime__stop_id',
            'stoptime__stop_sequence', 'stoptime__stop__stop_num',
            'stoptime__arrival_time', 'stoptime__departure_time'
        )

        # There are likely many Trip IDs that meet this (different times of the day)
        # For now we just use the first valid Trip ID
        logging.info(
            f"Found {len(trip_ids)} trips. Taking first: {trip_ids[0]['trip_id']}."
        )
        chosen_trip = list(
            filter(lambda trip: trip['trip_id'] == trip_ids[0]['trip_id'], trip_ids)
        )

        # Filter the trip stop times down to start and end point we're interested in
        chosen_trip_stop_times = list(utils.filter_trip_stop_times(
            chosen_trip,
            request.data['departure_stop_id'],
            request.data['arrival_stop_id']
        ))

        num_predictions = 5 if len(chosen_trip_stop_times) > 10 else 10

        multiprocessing_results = utils.multiprocessing_adjacent_stop_prediction(
            chosen_trip_stop_times,
            features,
            num_predictions
        )

        response = {
            'total_predictions': np.zeros(num_predictions),
            'stop_pairs': []
        }

        for res in multiprocessing_results:
            response['total_predictions'] += res['predictions']
            response['stop_pairs'].append(res)

        utils.plot_probabilistic_predictions(
            f"{request.data['departure_stop_id']}_to_{request.data['arrival_stop_id']}",
            response['total_predictions']
        )

        return Response(response, status=status.HTTP_200_OK)


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

    @staticmethod
    def get_stop_object(primary_key):
        """Return the Stop object for the currently authenticated user."""
        try:
            return Stop.objects.get(pk=primary_key)
        except Stop.DoesNotExist as stop_not_exist:
            raise Http404(f"Cannot find Stop: {primary_key}") from stop_not_exist

    def post(self, request):
        """Create a new FavoriteStop for the currently authenticated user."""
        stop_details = self.get_stop_object(request.data['stop'])
        serializer = FavoriteStopSerializer(data=request.data)
        if serializer.is_valid():
            # Associating the user that created the FavoriteStop, with the FavoriteStop instance
            serializer.save(owner=self.request.user, stop=stop_details)
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

    @staticmethod
    def get_stop_object(primary_key):
        """Return the Stop object for the currently authenticated user."""
        try:
            return Stop.objects.get(pk=primary_key)
        except Stop.DoesNotExist as stop_not_exist:
            raise Http404(f"Cannot find Stop: {primary_key}") from stop_not_exist

    def post(self, request):
        """Create a new FavoriteJourney for the currently authenticated user."""
        stop_origin = self.get_stop_object(request.data['stop_origin'])
        stop_destination = self.get_stop_object(request.data['stop_destination'])
        serializer = FavoriteJourneySerializer(data=request.data)
        if serializer.is_valid():
            # Associating the user that created the FavoriteStop, with the FavoriteStop instance
            serializer.save(owner=self.request.user,
                            stop_origin=stop_origin,
                            stop_destination=stop_destination)
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

class FavoriteLineView(APIView):
    """
    Get, Post or Delete a FavoriteLine instance(s) for the currently authenticated user.
    """

    permission_classes = [IsOwner]

    def get(self, request):
        """Return a list of all the FavoriteLines for the currently authenticated user."""
        favorite_lines = FavoriteLine.objects.filter(owner=self.request.user)
        serializer = FavoriteLineSerializer(favorite_lines, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new FavoriteLine for the currently authenticated user."""
        serializer = FavoriteLineSerializer(data=request.data)
        if serializer.is_valid():
            # Associating the user that created the FavoriteLine, with the FavoriteStop instance
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def get_object(primary_key):
        """Return the FavoriteLines object for the currently authenticated user."""
        try:
            return FavoriteLine.objects.get(pk=primary_key)
        except FavoriteLine.DoesNotExist as favorite_line_not_exist:
            raise Http404(
                f"Cannot find FavoriteLine: {primary_key}"
                ) from favorite_line_not_exist

    def delete(self, request, primary_key):
        """Delete a FavoriteLine for the currently authenticated user."""
        favorite_line = self.get_object(primary_key)
        self.check_object_permissions(self.request, favorite_line)
        favorite_line.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FeedbackQuestions(APIView):
    """
    Get, Post or Delete a FeedbackQuestion instance.
    """

    permission_classes = [IsAdminUser]

    @staticmethod
    def get_ques_object(primary_key):
        """Return the FeedbackQuestion object."""
        try:
            return FeedbackQuestion.objects.get(question_number=primary_key)
        except FeedbackQuestion.DoesNotExist as ques_not_exist:
            raise Http404(f"Cannot find Feedback Question: {primary_key}") from ques_not_exist

    def get(self, request, primary_key):
        """Return the Feedback Question for the currently authenticated admin user."""
        question = self.get_ques_object(primary_key)
        serializer = FeedbackQuestionSerializer(question)
        return Response(serializer.data)

    def post(self, request):
        """Create a new Feedback Question for the currently authenticated admin user."""
        serializer = FeedbackQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeedbackAnswers(APIView):
    """
    Post FeedbackAnswer instance.
    """

    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get_ques_object(primary_key):
        """Return the FeedbackQuestion object."""
        try:
            return FeedbackQuestion.objects.get(question_number=primary_key)
        except FeedbackQuestion.DoesNotExist as ques_not_exist:
            raise Http404(f"Cannot find Feedback Question: {primary_key}") from ques_not_exist

    def post(self, request):
        """Create a new FeedbackAmswer."""
        question = self.get_ques_object(request.data['question'])
        serializer = FeedbackAnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(question=question)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        # if the user had uploaded image (i.e. not using default icon)
        if user.image.name != 'default.png':
            # then delete file from /dublinbus_image
            user.image.delete()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, primary_key):
        """ Update User fields for the currently authenticated user. """
        user = self.get_object(primary_key)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # if put request contains image data and user is not using default image
            # i.e. replacing custom icon with another custom icon
            if ('image' in request.data.keys()) & (user.image.name != 'default.png'):
                print('Replacing custom icon with another custom icon.')
                # then delete first custom icon
                user.image.delete()
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserIconView(APIView):
    """ Get or Delete a User image.
    """

    def get(self, request):
        """Get a User image."""
        image_data = open(request.user.image.path, "rb").read()
        return HttpResponse(image_data, content_type="image/png")

    def delete(self, request):
        """Delete an uploaded User image."""
        # if the user had uploaded image (i.e. not using default icon)
        if request.user.image.name != 'default.png':
            # then delete their uploaded image from /dublinbus_image
            request.user.image.delete()
            # then set user image back to default
            request.user.image.name = 'default.png'
            request.user.save()
            return Response("Deleted icon successfully.",
                            status=status.HTTP_204_NO_CONTENT)
        return Response("No uploaded icon to delete.",
            status=status.HTTP_400_BAD_REQUEST)

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

    @staticmethod
    def get_object(primary_key):
        """Return the Marker object for the currently authenticated user."""
        try:
            return Marker.objects.get(pk=primary_key)
        except Marker.DoesNotExist as marker_not_exist:
            raise Http404(f"Cannot find Marker: {primary_key}") from marker_not_exist

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

    @staticmethod
    def get_object(primary_key):
        """Return the Theme object for the currently authenticated user."""
        try:
            return Theme.objects.get(pk=primary_key)
        except Theme.DoesNotExist as theme_not_exist:
            raise Http404(f"Cannot find Theme: {primary_key}") from theme_not_exist

    def put(self, request, primary_key):
        """ Update Theme fields for the currently authenticated user. """
        theme = self.get_object(primary_key)
        serializer = ThemeSerializer(theme, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(generics.UpdateAPIView):
    """
    Change password for Custom Users.
    """
    queryset = get_user_model().objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer


class GoogleSocialAuthView(GenericAPIView):
    """Google OAuth route."""
    permission_classes = [AllowAny]
    serializer_class = GoogleSocialAuthSerializer
    def post(self, request):
        """
        POST with "auth_token"
        Send an "id_token" from google to get user information
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = (serializer.validated_data['auth_token'])
        return Response(data, status=status.HTTP_200_OK)


class FacebookSocialAuthView(GenericAPIView):
    """Facebook OAuth route."""
    permission_classes = [AllowAny]
    serializer_class = FacebookSocialAuthSerializer
    def post(self, request):
        """
        POST with "auth_token"
        Send an "accessToken" from facebook to get user information
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = (serializer.validated_data['auth_token'])
        return Response(data, status=status.HTTP_200_OK)
