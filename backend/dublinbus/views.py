from datetime import datetime, timedelta, timezone
from django.shortcuts import render
from django.http import JsonResponse

from .models import Route, Stop, Trip, StopTime


def index(request):
    return render(request, 'dublinbus/index.html')

def stop(request, stop_id):
    """Returns all of the scheduled arrivals for a particular stop within the next hour and
    any delays to those schedules from the real-time data."""

    stop_details = Stop.objects.get(stop_id=stop_id)

    response = {
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

    for stop_time in stop_time_details:
        response['arrivals'].append({
            'route_id': stop_time.trip.route.route_id,
            'trip_id': stop_time.trip.trip_id,
            'scheduled_arrival_time': stop_time.arrival_time,
            'scheduled_departure_time': stop_time.departure_time,
            'stop_sequence': stop_time.stop_sequence,
            'delay': 0
        })

    return JsonResponse(response)

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
        for stop in stop_times:
            trip_output['stops'].append({
                'stop_id': stop.stop_id,
                'arrival_time': stop.arrival_time,
                'departure_time': stop.departure_time
            })
        trips_simple.append(trip_output)

    response = {
        'route_id': route_id,
        'route_name': route_details.route_short_name,
        'trips': trips_simple
    }

    return JsonResponse(response)
