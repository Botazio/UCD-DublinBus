from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from .managers import CustomUserManager

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

    def __str__(self):
        return str(self.route_id)

class Calendar(models.Model):
    """
    A class to represent a set of dates when service is available for routes.
    Attributes
    ---
        service_id: str
            Uniquely identifies a set of dates when service is available for one or more routes.
            Each service_id value can appear at most once in a calendar.txt file.
        monday: bool
            Indicates whether the service operates on all Mondays
            in the date range specified by the start_date and end_date fields.
            1 - Service is available for all Mondays in the date range.
            0 - Service is not available for Mondays in the date range.
        tuesday: bool
            Functions in the same way as monday except applies to Tuesdays.
        wednesday: bool
            Functions in the same way as monday except applies to Wednesdays.
        thursday: bool
            Functions in the same way as monday except applies to Thursdays.
        friday: bool
            Functions in the same way as monday except applies to Fridays.
        saturday: bool
            Functions in the same way as monday except applies to Saturdays.
        sunday: bool
            Functions in the same way as monday except applies to Sundays.
        start_date: date
            Start service day for the service interval.
        end_date: date
            End service day for the service interval. This service day is included in the interval.
    """

    service_id = models.CharField(max_length=20, primary_key=True)
    monday = models.BooleanField()
    tuesday = models.BooleanField()
    wednesday = models.BooleanField()
    thursday = models.BooleanField()
    friday = models.BooleanField()
    saturday = models.BooleanField()
    sunday = models.BooleanField()
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return str(self.service_id)

class Trip(models.Model):
    """
    A class to represent a Dublin Bus trip. A trip is a specific
    instance of a Route at a particular time and direction. Every
    Route will have one or more Trips.

    Attributes
    ---
        trip_id: str
            The ID for that trip assigned by Dublin Bus.
        calendar: Calendar
            The Calendar that this Trip is associated with.
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
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    shape_id = models.CharField(max_length=120)
    trip_headsign = models.CharField(max_length=120)
    direction_id = models.IntegerField()
    route = models.ForeignKey(Route, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.trip_id)

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
        stop: Stop
            The Stop that this StopTime is associated with.
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
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
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

class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    A class that represents the users in the system.
    """
    username = models.CharField(max_length=40, unique=True) # added in
    email = models.EmailField(_('email address'), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'username'    # 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class FavouriteStop(models.Model):
    """
    A class that represents the users favourite Dublin Bus stops.
    """
    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('dublinbus.CustomUser',
                              related_name='favouritestops',
                              on_delete=models.CASCADE) # auth.User
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)

    class Meta:
        ordering = ['created']
        unique_together = (("stop", "owner"),) # "surrogate" primary key column

    def __str__(self):
        return str(self.owner) + ' - ' + str(self.stop_id)

class FavouriteJourney(models.Model):
    """
    A class that represents the users favourite Dublin Bus journeys.
    """
    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('dublinbus.CustomUser',
                              related_name='favouritejourneys',
                              on_delete=models.CASCADE) # auth.User
    stop_origin = models.ForeignKey(Stop,
                                    on_delete=models.CASCADE,
                                    related_name='stop_origin')
    stop_destination = models.ForeignKey(Stop,
                                         on_delete=models.CASCADE,
                                         related_name='stop_destination')

    class Meta:
        ordering = ['created']
        unique_together = (("stop_origin", "stop_destination", "owner"),)

    def __str__(self):
        return str(self.owner) + ' - ' + str(self.stop_origin) + ' -> ' + str(self.stop_destination)
