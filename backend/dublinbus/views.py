from datetime import datetime, timedelta, timezone
from django.shortcuts import render
from django.http import JsonResponse, Http404

from dublinbus.models import Route, Stop, Trip, StopTime
import dublinbus.utils as utils


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
        if stop_time.trip.service_id in utils.date_to_service_ids(current_date):

            delay = utils.get_realtime_dublin_bus_delay(realtime_updates,
                                                    stop_time.trip.trip_id,
                                                    stop_time.stop_sequence)

            result['arrivals'].append({
                'route_id': stop_time.trip.route.route_id,
                'trip_id': stop_time.trip.trip_id,
                'direction': stop_time.trip.direction_id,
                'destination_stop_name': StopTime.objects.filter(trip_id=stop_time.trip.trip_id) \
                                                          .order_by('-stop_sequence')[:1] \
                                                          .first().stop.stop_name,
                'line': stop_time.trip.route.route_short_name,
                'service_id': stop_time.trip.service_id,
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
