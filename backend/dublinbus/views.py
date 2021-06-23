from datetime import datetime, timedelta, timezone
import requests
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse, Http404

from dublinbus.models import Route, Stop, Trip, StopTime


def index(request):
    """Temporary homepage for the application"""
    return render(request, 'dublinbus/index.html')

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
    current_time = datetime.now(timezone(timedelta(hours=1)))
    stop_time_details = StopTime.objects.filter(
        stop_id=stop_id,
        # Get all arrival times in the next hour
        arrival_time__gte=current_time.time(),
        arrival_time__lte=(current_time + timedelta(hours=1)).time()
    )

    # Get realtime data from NTA API
    realtime_updates = request_realtime_nta_data()

    for stop_time in stop_time_details:

        delay = get_realtime_dublin_bus_delay(realtime_updates,
                                              stop_time.trip.trip_id,
                                              stop_time.stop_sequence)

        result['arrivals'].append({
            'route_id': stop_time.trip.route.route_id,
            'trip_id': stop_time.trip.trip_id,
            'scheduled_arrival_time': stop_time.arrival_time,
            'scheduled_departure_time': stop_time.departure_time,
            'stop_sequence': stop_time.stop_sequence,
            'delay': delay,
            'due_in_sec': get_due_in_time(current_time, stop_time.arrival_time, delay, "sec"),
            'due_in_min': get_due_in_time(current_time, stop_time.arrival_time, delay, "min")
        })

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
                'departure_time': stop_time.departure_time
            })
        trips_simple.append(trip_output)

    response = {
        'route_id': route_id,
        'route_name': route_details.route_short_name,
        'trips': trips_simple
    }

    return JsonResponse(response)

def request_realtime_nta_data():
    """
    Make a request to the NTA realtime API
    """

    headers = {
        # Request headers
        'Cache-Control': 'no-cache',
        'x-api-key': settings.NTA_DEVELOPER_KEY
    }
    realtime_response = requests.get(
        'https://gtfsr.transportforireland.ie/v1/?format=json',
        headers=headers
    )

    return realtime_response.json()['entity']

def get_realtime_dublin_bus_delay(realtime_updates, trip_id, stop_sequence):
    """
    Get the current delay for a particular trip from the response from the
    realtime NTA API.
    Args
    ---
        realtime_updates: list
            A list of dicts with updates for each trip from the realtime API
        trip_id: str
            The ID for the trip we want to get the delay for
        stop_sequence: int
            The stop sequence number for this stop in this trip
            
    Returns
    ---
        The current delay for the trip in seconds. 0 means there is no delay and a negative
        number means the bus is ahead of schedule.
    """

    # Get stop time updates for this trip or else return None
    trip_updates = next(filter(lambda trip: trip['id'] == trip_id, realtime_updates), None)

    if trip_updates:

        stop_time_updates = trip_updates['trip_update'].get('stop_time_update')

        if stop_time_updates:

            # Sort updates in reverse order by stop_sequence
            stop_time_updates = sorted(
                stop_time_updates,
                key=lambda update: update['stop_sequence'],
                reverse=True
            )

            # Only get delay if stop_sequence of latest update is lower than the
            # stop_sequence of the requested stop
            if stop_time_updates[0]['stop_sequence'] < stop_sequence:
                return stop_time_updates[0]['departure']['delay']

    return 0


def get_due_in_time(current_time, scheduled_arrival_time, delay, unit_time):
    """
    Calculate the expected due time from now for a particular trip.

    Args
    ---
        current_time: datetime object
            The time of when query was made in UTC.
        scheduled_arrival_time: datetime.time
            The time the bus is scheduled to arrive at the stopid in UTC.
        delay: int
            The current delay for the trip in seconds.
        unit_time: str
            Either "sec" or "min" to specify the unit of time the function is to return the due time in.
    Returns
    ---
        The expected due time for trip in seconds or minutes as an int.
    """

    print('delay', type(delay))
    # extract date from curr_time and concatenate to scheduled_arrival_time (time past midnight) e.g. "23/06/21 " + "12:04:25" = "23/06/21 12:04:25"
    scheduled_arrival_datetime_str = current_time.strftime("%d/%m/%y ") + str(scheduled_arrival_time)
    # create datetime object for scheduled_arrival_datetime
    scheduled_arrival_datetime_obj = datetime.strptime(scheduled_arrival_datetime_str, '%d/%m/%y %H:%M:%S').replace(
        tzinfo=timezone(timedelta(hours=1)))  # tzinfo=timezone.utc
    # subtract current_time from scheduled_arrival_datetime_obj
    # scheduled_arrival_time given to second precision so removing microsecond precision from current_time
    time_delta = scheduled_arrival_datetime_obj - current_time.replace(microsecond=0)
    # add delay to due time
    time_delta_seconds = time_delta.total_seconds() + delay

    if unit_time == "sec":
        return int(time_delta_seconds)
    elif unit_time == "min":
        return round(time_delta_seconds / 60)  # important decision for display - round(), math.floor() or math.ceil()