from datetime import datetime, timedelta
from locust import HttpUser, task, between

class BaseRouteTests(HttpUser):
    """
    Load tests for the Django backend
    running on the UCD server"""

    host = "https://csi420-02-vm6.ucd.ie"

    wait_time = between(1, 5)

    @task
    def stops(self):
        """Send a GET request to /stops/"""
        self.client.get(url="/stops/")

    @task
    def lines(self):
        """Send a GET request to /lines/"""
        self.client.get(url="/lines/")

    @task
    def stop_id(self):
        """Send a GET request to /stop/<stop_id>"""
        self.client.get(url="/stop/8220DB000002/")

    @task
    def route(self):
        """Send a GET request to /route/<route_id>"""
        self.client.get(url="/route/60-1-b12-1/")

    @task
    def stop_by_trip(self):
        """Send a GET request to /stops_by_trip/<trip_id>"""
        self.client.get(
            "/stops_by_trip/10893.y1009.60-37-d12-1.39.O/"
        )

    @task
    def shape_by_trip(self):
        """Send a GET request to /shape_by_trip/<trip_id>"""
        self.client.get(
            "/shape_by_trip/10893.y1009.60-37-d12-1.39.O/"
        )


class PredictRouteTests(HttpUser):
    """
    Load tests for the predict endpoint running on the
    GCP server"""

    host = "https://dublin-bus.net"

    wait_time = between(1, 5)

    @task
    def predict_short(self):
        """Very short journey from UCD Stop 767 to
        UCD Stop 768 (adjacent stops)"""

        data = {
            "route_id": "60-39A-d12-1",
            "direction_id": 0,
            "departure_stop_id": "8250DB000767",
            "arrival_stop_id": "8250DB000768",
            "datetime": (datetime.now()
                + timedelta(hours=1)).strftime("%m/%d/%Y, %H:%M:%S"),
        }

        self.client.post(url="/predict/", data=data)

    @task
    def predict_medium(self):
        """Medium journey from UCD Stop 767 to
        Dawon Street Stop 793"""

        data = {
            "route_id": "60-39A-d12-1",
            "direction_id": 0,
            "departure_stop_id": "8250DB000767",
            "arrival_stop_id": "8220DB000793",
            "datetime": (datetime.now()
                + timedelta(hours=1)).strftime("%m/%d/%Y, %H:%M:%S"),
        }

        self.client.post(url="/predict/", data=data)

    @task
    def predict_long(self):
        """Full route journey from UCD Stop 767 to
        Ongar Square Stop 7160"""

        data = {
            "route_id": "60-39A-d12-1",
            "direction_id": 0,
            "departure_stop_id": "8250DB000767",
            "arrival_stop_id": "8240DB007160",
            "datetime": (datetime.now()
                + timedelta(hours=1)).strftime("%m/%d/%Y, %H:%M:%S"),
        }

        self.client.post(url="/predict/", data=data)
