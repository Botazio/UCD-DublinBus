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

class Shape(models.Model):
    """
    A class to describe the path that a vehicle travels along a route alignment.
    Shapes are associated with Trips, and consist of a sequence of points
    through which the vehicle passes in order.
    Attributes
    ---
        shape_id: str
            Identifies a shape.
        shape_pt_lat: str
            Latitude of a shape point.
        shape_pt_lon: str
            Longitude of a shape point.
        shape_pt_sequence: str
            Sequence in which the shape points connect to form the shape.
            Values must increase along the trip but do not need to be consecutive.
        shape_dist_traveled: str
            Actual distance traveled along the shape from the first shape point
            to the point specified in this record
    """

    shape_id = models.CharField(max_length=120)
    shape_pt_lat = models.FloatField()
    shape_pt_lon = models.FloatField()
    shape_pt_sequence = models.IntegerField()
    shape_dist_traveled = models.FloatField()

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
    image = models.ImageField(upload_to='dublinbus_images', default='default.png')
    map = models.CharField(max_length=120, default='defaultThemeLight')
    auth_provider = models.CharField(
        max_length=255, blank=False,
        null=False, default='email')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'password']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class FavoriteStop(models.Model):
    """
    A class that represents the user's favorite Dublin Bus stops.
    """
    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('dublinbus.CustomUser',
                              related_name='favoritestops',
                              on_delete=models.CASCADE) # auth.User
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)

    class Meta:
        ordering = ['created']
        unique_together = (("stop", "owner"),) # "surrogate" primary key column

    def __str__(self):
        return str(self.owner) + ' - ' + str(self.stop_id)

class FavoriteJourney(models.Model):
    """
    A class that represents the user's favorite Dublin Bus journeys.
    """
    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('dublinbus.CustomUser',
                              related_name='favoritejourneys',
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

class Theme(models.Model):
    """
    A class that represents the user's selection of appearance options.
    """
    owner = models.OneToOneField('dublinbus.CustomUser',
                              related_name='theme',
                              on_delete=models.CASCADE,
                                 primary_key=True,)
    primary = models.CharField(max_length=120, default='#0094EC')
    divider = models.CharField(max_length=120, default='#D3D3D3')
    background_primary = models.CharField(max_length=120, default='#FFFFFF')
    background_secondary = models.CharField(max_length=120, default='#fafafa')
    icon_color = models.CharField(max_length=120, default='#000000')
    font_color = models.CharField(max_length=120, default='#000000')
    font_size = models.CharField(max_length=120, default='1rem')

    def __str__(self):
        return str(self.owner.username)

class Marker(models.Model):
    """
    A class that represents the user's selection of markers to be displayed on the map.
    """
    owner = models.OneToOneField('dublinbus.CustomUser',
                              related_name='markers',
                              on_delete=models.CASCADE,
                              primary_key=True,)
    accounting = models.BooleanField(default=False)
    airport = models.BooleanField(default=False)
    amusement_park = models.BooleanField(default=False)
    aquarium = models.BooleanField(default=False)
    art_gallery = models.BooleanField(default=False)
    atm = models.BooleanField(default=False)
    bakery = models.BooleanField(default=False)
    bank = models.BooleanField(default=False)
    bar = models.BooleanField(default=False)
    beauty_salon = models.BooleanField(default=False)
    bicycle_store = models.BooleanField(default=False)
    book_store = models.BooleanField(default=False)
    bowling_alley = models.BooleanField(default=False)
    cafe = models.BooleanField(default=False)
    campground = models.BooleanField(default=False)
    car_dealer = models.BooleanField(default=False)
    car_rental = models.BooleanField(default=False)
    car_repair = models.BooleanField(default=False)
    car_wash = models.BooleanField(default=False)
    casino = models.BooleanField(default=False)
    cemetery = models.BooleanField(default=False)
    church = models.BooleanField(default=False)
    city_hall = models.BooleanField(default=False)
    clothing_store = models.BooleanField(default=False)
    convenience_store = models.BooleanField(default=False)
    courthouse = models.BooleanField(default=False)
    dentist = models.BooleanField(default=False)
    department_store = models.BooleanField(default=False)
    doctor = models.BooleanField(default=False)
    drugstore = models.BooleanField(default=False)
    electrician = models.BooleanField(default=False)
    electronics_store = models.BooleanField(default=False)
    embassy = models.BooleanField(default=False)
    fire_station = models.BooleanField(default=False)
    florist = models.BooleanField(default=False)
    funeral_home = models.BooleanField(default=False)
    furniture_store = models.BooleanField(default=False)
    gas_station = models.BooleanField(default=False)
    gym = models.BooleanField(default=False)
    hair_care = models.BooleanField(default=False)
    hardware_store = models.BooleanField(default=False)
    hindu_temple = models.BooleanField(default=False)
    home_goods_store = models.BooleanField(default=False)
    hospital = models.BooleanField(default=False)
    insurance_agency = models.BooleanField(default=False)
    jewelry_store = models.BooleanField(default=False)
    laundry = models.BooleanField(default=False)
    lawyer = models.BooleanField(default=False)
    library = models.BooleanField(default=False)
    light_rail_station = models.BooleanField(default=False)
    liquor_store = models.BooleanField(default=False)
    local_government_office = models.BooleanField(default=False)
    locksmith = models.BooleanField(default=False)
    lodging = models.BooleanField(default=False)
    meal_delivery = models.BooleanField(default=False)
    meal_takeaway = models.BooleanField(default=False)
    mosque = models.BooleanField(default=False)
    movie_rental = models.BooleanField(default=False)
    movie_theater = models.BooleanField(default=False)
    moving_company = models.BooleanField(default=False)
    museum = models.BooleanField(default=False)
    night_club = models.BooleanField(default=False)
    painter = models.BooleanField(default=False)
    park = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    pet_store = models.BooleanField(default=False)
    pharmacy = models.BooleanField(default=False)
    physiotherapist = models.BooleanField(default=False)
    plumber = models.BooleanField(default=False)
    police = models.BooleanField(default=False)
    post_office = models.BooleanField(default=False)
    primary_school = models.BooleanField(default=False)
    real_estate_agency = models.BooleanField(default=False)
    restaurant = models.BooleanField(default=False)
    roofing_contractor = models.BooleanField(default=False)
    rv_park = models.BooleanField(default=False)
    school = models.BooleanField(default=False)
    secondary_school = models.BooleanField(default=False)
    shoe_store = models.BooleanField(default=False)
    shopping_mall = models.BooleanField(default=False)
    spa = models.BooleanField(default=False)
    stadium = models.BooleanField(default=False)
    storage = models.BooleanField(default=False)
    store = models.BooleanField(default=False)
    subway_station = models.BooleanField(default=False)
    supermarket = models.BooleanField(default=False)
    synagogue = models.BooleanField(default=False)
    taxi_stand = models.BooleanField(default=False)
    tourist_attraction = models.BooleanField(default=False)
    train_station = models.BooleanField(default=False)
    transit_station = models.BooleanField(default=False)
    travel_agency = models.BooleanField(default=False)
    university = models.BooleanField(default=False)
    veterinary_care = models.BooleanField(default=False)
    zoo = models.BooleanField(default=False)

    def __str__(self):
        return str(self.owner.username)