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
            'ACTUALTIME_DEP': 'TIME_DEPARTURE',
            'STOPPOINTID': 'DEPARTURE_STOP'
        })

        # arrival stop and time are from the next row
        stop_pairs_trip.loc[:,
                            'ARRIVAL_STOP'] = stop_pairs_trip.shift(-1).loc[:, 'DEPARTURE_STOP']
        stop_pairs_trip.loc[:,
                            'TIME_ARRIVAL'] = stop_pairs_trip.shift(-1).loc[:, 'ACTUALTIME_ARR']
        stop_pairs_trip['TRAVEL_TIME'] = stop_pairs_trip["TIME_ARRIVAL"] - \
            stop_pairs_trip["TIME_DEPARTURE"]

        # Only keep pairs with consecutive PROGRNUMBER
        stop_pairs_trip = stop_pairs_trip[stop_pairs_trip['PROGRNUMBER'] == (
            stop_pairs_trip.shift(-1)['PROGRNUMBER'] - 1)]

        # Add it to the DF of all stop pairs
        stop_pairs.append(stop_pairs_trip)

    return pd.concat(stop_pairs)
