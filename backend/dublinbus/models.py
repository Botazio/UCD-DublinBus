from django.db import models

class Stop(models.Model):
    """
    A class to represent a Dublin Bus stop

    Attributes
    ---
        stop_id: str
            The stop ID from Dublin Bus
        stop_name: str
            The stop name and number (e.g.,
            Parnell Square West, stop 2)
        stop_lat: float
            Stop latitude
        stop_lon: float
            Stop longitude
    """

    stop_id = models.CharField(max_length=120, primary_key=True)
    stop_name = models.CharField(max_length=120)
    stop_num = models.IntegerField()
    stop_lat = models.FloatField()
    stop_lon = models.FloatField()

    def __str__(self):
        return str(self.stop_name)


class Route(models.Model):
    """
    A class to represent a Dublin Bus route

    Attributes
    ---
        route_id: str
            The route ID from Dublin Bus
        agency_id: str
            The agency ID. 978 indicates Dublin Bus
        route_short_name: str
            The name of the Dublin Bus route (e.g., 39A)
        route_long_name: str
            A longer name for the Dublin Bus route
        route_type: str

    """

    route_id = models.CharField(max_length=120, primary_key=True)
    agency_id = models.CharField(max_length=120)
    route_short_name = models.CharField(max_length=120)
    route_long_name = models.CharField(max_length=200)
    route_type = models.IntegerField()


class Trip(models.Model):
    """
    A class to represent a Dublin Bus trip. A trip is a specific
    instance of a Route at a particular time and direction. Every
    Route will have one or more Trips.

    Attributes
    ---
        trip_id: str
            The ID for that trip assigned by Dublin Bus.
        service_id: str
            The service ID from calendar.txt. Indicates what
            days of the week the trip is running on.
        shape_id:
            The shape ID from shapes.txt.
        trip_headsign:

        direction_id: int
            The direction the trip is running in. Either 0 or 1.
        route: Route
            The Route that this Trip is associated with
    """

    trip_id = models.CharField(max_length=120, primary_key=True)
    service_id = models.CharField(max_length=120)
    shape_id = models.CharField(max_length=120)
    trip_headsign = models.CharField(max_length=120)
    direction_id = models.IntegerField()
    route = models.ForeignKey(Route, on_delete=models.CASCADE)


class StopTime(models.Model):
    """
    A class that represents when a bus on a particular Trip is scheduled
    to stop at a certain stop in that trip. This does not account for
    any real-time delays

    Attributes
    ---
        arrival_time: timestamp
            The time that the bus is scheduled to arrive
        departure_time: timestamp
            The time that the bus is scheduled to leave
        stop_id: str
            The ID for the stop
        stop_sequence: int
            The stop number for this stop on this trip starting
            from 1. For example, 3 is the third stop on this trip.
        stop_headsign: str

        pickup_type: int

        drop_off_type: int

        shape_dist_traveled: float
            Total distance travelled since first stop in the sequence (in metres (?))
    """

    arrival_time = models.TimeField()
    departure_time = models.TimeField()
    stop_id = models.CharField(max_length=120)
    stop_sequence = models.IntegerField()
    stop_headsign = models.CharField(max_length=120)
    pickup_type = models.IntegerField()
    drop_off_type = models.IntegerField()
    shape_dist_traveled = models.FloatField()
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    
class Line(models.Model):
    """
    A class to represents the bus lines that run through all Dublin bus stops.
    1-to-many relationship with Stop class.
    
    Attributes
    ---
        stop: Stop
            The Stop that these bus lines run through.
        line: str
            The bus line that run through the particular stop.
    """
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
    line = models.CharField(max_length=10)
