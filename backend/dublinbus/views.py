from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import json

from .models import Route, Stop, Trip, StopTime


def index(request):
    return render(request, 'dublinbus/index.html')


def stop(request, stop_id):
    stop_details = Stop.objects.get(stop_id=stop_id)

    return JsonResponse({
        'stop_id': stop_id,
        'stop_name': stop_details.stop_name,
        'stop_lat': stop_details.stop_lat,
        'stop_lon': stop_details.stop_lon,
    })

def route(request, route_id):
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

