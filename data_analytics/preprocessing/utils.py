import datetime
import pandas as pd

def create_adjacent_stop_pairs(trips):
    """
    Takes a DataFrame of trips from the 2018 data
    and returns each pair of adjacent stops for each
    trip separately in a DataFrame
    """

    stop_pairs = []

    sorted_trips = trips.sort_values(
        ['TRIPID', 'PROGRNUMBER']).reset_index(drop=True)

    # For each trip match up pairs of adjacent stops and calculate how long it
    # took to travel between them
    for trip_id in sorted_trips['TRIPID'].unique():

        # Filter down to just this trip
        trip = sorted_trips[sorted_trips['TRIPID'] ==
                            trip_id].sort_values(['TRIPID', 'PROGRNUMBER'])

        stop_pairs_trip = trip.copy()
        stop_pairs_trip = stop_pairs_trip.rename(columns={
            'ACTUALTIME_DEP': 'time_departure',
            'STOPPOINTID': 'departure_stop'
        })

        # arrival stop and time are from the next row
        stop_pairs_trip.loc[:,
                            'arrival_stop'] = stop_pairs_trip.shift(-1).loc[:, 'departure_stop']
        stop_pairs_trip.loc[:,
                            'time_arrival'] = stop_pairs_trip.shift(-1).loc[:, 'ACTUALTIME_DEP']
        stop_pairs_trip['travel_time'] = stop_pairs_trip["time_arrival"] - \
            stop_pairs_trip["time_departure"]

        # Only keep pairs with consecutive PROGRNUMBER
        stop_pairs_trip = stop_pairs_trip[stop_pairs_trip['PROGRNUMBER'] == (
            stop_pairs_trip.shift(-1)['PROGRNUMBER'] - 1)]

        # Add it to the DF of all stop pairs
        stop_pairs.append(stop_pairs_trip)

    return pd.concat(stop_pairs)

def normalise_time(time_str):
    """
    Some of the raw Dublin Bus data has invalid times for hours after midnight
    (e.g., 25:00 for 1am). This function corrects any time string with this
    problem so that we can work with it using Pandas datetimes

    Args
    ---
        time_str: str
            A time as a string

    Returns
    ---
    A time string with only the hour corrected if necessary
    """

    hour = time_str.split(":")[0]
    if int(hour) >= 24:
        normalised_hour = int(hour) % 24
        return time_str.replace(hour, f"{normalised_hour:02}")

    return time_str

def parse_stop_num(stop_name, stop_id):
    """
    The 2021 Dublin Bus data uses Stop IDs instead of the actual stop
    numbers presented to the public. This method tries to extract the stop
    number from the stop name and if this fails it tries to extract it from
    the ID instead.

    Args
    ---
        stop_name: str
            The stop name as a string

        stop_id: str
            The stop ID as a string

    Returns
    ---
    An int for the extracted stop number
    """

    try:
        stop_num = int(stop_name.split(" ")[-1])
    except ValueError:
        # stop number isn't in the name
        # try parse out of ID instead
        stop_num = int(stop_id.split("DB")[-1])

    return stop_num

bank_holidays_2018 = [
    # New Year's Day
    datetime.date(2018, 1, 1),
    # St Patricks' Day
    datetime.date(2018, 3, 17),
    # Easter Monday
    datetime.date(2018, 4, 2),
    # May Bank Holiday
    datetime.date(2018, 5, 7),
    # June Bank Holiday
    datetime.date(2018, 6, 4),
    # August Bank Holiday
    datetime.date(2018, 8, 6),
    # October Bank Holiday
    datetime.date(2018, 10, 29),
    # Christmas Day
    datetime.date(2018, 12, 25),
    # St Stephen's Day
    datetime.date(2018, 12, 26),
]
