import pandas as pd

def create_adjacent_stop_pairs(trips):
    sorted_trips = trips.sort_values(['TRIPID', 'PROGRNUMBER']).reset_index(drop=True)

    stop_pairs_df = pd.DataFrame({
        'TRIPID': [],
        'ROUTEID': [],
        'DAYOFSERVICE': [],
        'DEPARTURE_STOP': [],
        'TIME_DEPARTURE': [],
        'ARRIVAL_STOP': [],
        'TIME_ARRIVAL': [],
        'TRAVEL_TIME': []
    })

    # For each trip match up pairs of adjacent stops and calculate how long it
    # took to travel between them
    for trip_id in sorted_trips['TRIPID'].unique():

        # Filter down to just this trip
        trip = sorted_trips[sorted_trips['TRIPID'] == trip_id].sort_values(['TRIPID', 'PROGRNUMBER'])

        # Get info on all pairs of stops for this trip
        stop_pairs_trip = pd.DataFrame()
        stop_pairs_trip['TRIPID'] = trip['TRIPID']
        stop_pairs_trip['ROUTEID'] = trip['ROUTEID']
        stop_pairs_trip['DAYOFSERVICE'] = trip['DAYOFSERVICE']
        stop_pairs_trip.loc[:, 'DEPARTURE_STOP'] = trip.loc[:, 'STOPPOINTID']
        stop_pairs_trip.loc[:, 'TIME_DEPARTURE'] = trip.loc[:, 'ACTUALTIME_DEP']
        stop_pairs_trip.loc[:, 'ARRIVAL_STOP'] = trip.shift(-1).loc[:, 'STOPPOINTID']
        stop_pairs_trip.loc[:, 'TIME_ARRIVAL'] = trip.shift(-1).loc[:, 'ACTUALTIME_ARR']
        stop_pairs_trip['TRAVEL_TIME'] = stop_pairs_trip["TIME_ARRIVAL"] - stop_pairs_trip["TIME_DEPARTURE"]

        stop_pairs_trip[['HOUR', 'DAY']] = trip[['HOUR', 'DAY']]

        # Add it to the DF of all stop pairs
        stop_pairs_df = stop_pairs_df.append(stop_pairs_trip)

    return stop_pairs_df
