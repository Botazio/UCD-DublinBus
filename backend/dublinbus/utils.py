from datetime import datetime, timedelta, timezone
import pickle
import requests
from django.conf import settings

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


def get_due_in_time(current_time, scheduled_arrival_time, delay):
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
    Returns
    ---
        The expected due time for trip in minutes as an int.
    """

    # extract date from curr_time and concatenate to scheduled_arrival_time (time past midnight)
    # e.g. "23/06/21 " + "12:04:25" = "23/06/21 12:04:25"
    scheduled_arrival_datetime_str = current_time.strftime(
        "%d/%m/%y ") + str(scheduled_arrival_time)

    # create datetime object for scheduled_arrival_datetime.
    scheduled_arrival_datetime_obj = datetime.strptime(scheduled_arrival_datetime_str,
                                                       '%d/%m/%y %H:%M:%S').replace(
        tzinfo=timezone(timedelta(hours=1)))

    # subtract current_time from scheduled_arrival_datetime_obj
    # To be able to subtract, both scheduled_arrival_datetime_obj and current_time must be
    # datetime objects and in the same timezone
    # scheduled_arrival_time given to second precision so removing microsecond
    # precision from current_time
    time_delta = scheduled_arrival_datetime_obj - \
        current_time.replace(microsecond=0)

    # add delay to due time
    time_delta_seconds = time_delta.total_seconds() + delay
    return round(time_delta_seconds / 60)


def date_to_service_ids(current_date):
    """
    A function which returns which service IDs are valid on the given date.
    This is taken from the calendar.txt file from the static GTFS Dublin Bus data.

    Args
    ---
        current_date: datetime
            A datetime object for the current day
    """

    # Get the day of the week
    day = current_date.strftime("%A")

    # A mapping from days to service IDs from calendar.txt
    # Service IDs "2" and "3" have an end date of 20210612
    # and are therefore not included
    days_to_service_ids_mapping = {
        "Monday": ["y1003", "y1004"],
        "Tuesday": ["y1003"],
        "Wednesday": ["y1003"],
        "Thursday": ["y1003"],
        "Friday": ["y1003"],
        "Saturday": ["y1005#1"],
        "Sunday": ["y1004"]
    }

    return days_to_service_ids_mapping[day]

def predict_adjacent_stop(departure_stop_num, arrival_stop_num):
    """
    Predict the time to travel between two adjacent stops on the same route trip.
    This method uses stop numbers and not stop IDs since stop IDs are not available
    in the historical data used to train the model.

    Args
    ---
        departure_stop_num: int
            The number of the departure stop (e.g., 767)

        departure_stop_num: int
            The number of the departure stop (e.g., 768)

    Returns
    ---
        An int for the predicted travel time between the two adjacent stops. Returns
        a KeyError in the case a prediction cannot be found between two stops.
    """

    model = pickle.load(open(
        "./model_output/historical_averages/historical_averages.pickle",
        "rb"
        )
    )

    return model[f"{departure_stop_num}_to_{arrival_stop_num}"]
