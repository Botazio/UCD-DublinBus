from django.db import models

class Stop(models.Model):
    stop_id = models.CharField(max_length=120, primary_key=True)
    stop_name = models.CharField(max_length=120)
    stop_lat = models.FloatField()
    stop_lon = models.FloatField()

    def __str__(self):
        return str(self.stop_name)


class Route(models.Model):
    route_id = models.CharField(max_length=120, primary_key=True)
    agency_id = models.CharField(max_length=120)
    route_short_name = models.CharField(max_length=120)
    route_long_name = models.CharField(max_length=200)
    route_type = models.IntegerField()


class Trip(models.Model):
    trip_id = models.CharField(max_length=120, primary_key=True)
    service_id = models.CharField(max_length=120)
    shape_id = models.CharField(max_length=120)
    trip_headsign = models.CharField(max_length=120)
    direction_id = models.IntegerField()
    route = models.ForeignKey(Route, on_delete=models.CASCADE)


class StopTime(models.Model):
    arrival_time = models.TimeField()
    departure_time = models.TimeField()
    stop_id = models.CharField(max_length=120)
    stop_sequence = models.CharField(max_length=120)
    stop_headsign = models.CharField(max_length=120)
    pickup_type = models.IntegerField()
    drop_off_type = models.IntegerField()
    shape_dist_traveled = models.FloatField()
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
