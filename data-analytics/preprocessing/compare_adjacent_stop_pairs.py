import os
import argparse
import logging
import glob
import sqlite3
import datetime
import pandas as pd
from .utils import parse_stop_num, normalise_time

logging.basicConfig(
    filename=f"/home/team13/logs/preprocessing/compare_2018_2021_{datetime.datetime.now()}",
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Command line argument to turn on downloading of new data
parser = argparse.ArgumentParser()
parser.add_argument('--download', help="Download new 2021 data", action="store_true")
args = parser.parse_args()

if args.download:
    logging.info("Downloading latest 2021 data for comparison")

    GTFS_STATIC_ZIP = "https://www.transportforireland.ie/transitData/google_transit_dublinbus.zip"
    os.system(f'wget {GTFS_STATIC_ZIP} -P /home/team13/UCD-DublinBus/data-analytics/')
    os.system("unzip /home/team13/UCD-DublinBus/data-analytics/google_transit_dublinbus.zip")

    stop_times = pd.read_csv(
        "stop_times.txt",
        usecols=['trip_id', 'stop_sequence', 'stop_id', 'arrival_time', 'departure_time']
    ).sort_values(['trip_id', 'stop_sequence'])
    trips = pd.read_csv("trips.txt", usecols=['trip_id', 'route_id'])
    stops = pd.read_csv('stops.txt', usecols=['stop_name', 'stop_id'])
    routes = pd.read_csv('routes.txt', usecols=['route_id', 'route_short_name'])

    stop_times = stop_times.merge(stops, on='stop_id', how='left')
    stop_times = stop_times.merge(trips, on='trip_id', how='left')
    stop_times = stop_times.merge(routes, on='route_id', how='left')
    stop_times['stop_num'] = stop_times.apply(lambda row:
                                                parse_stop_num(row['stop_name'], row['stop_id']),
                                                axis=1)

    stop_pairs = []
    for trip_id in stop_times['trip_id'].unique().tolist():

        trip_df = stop_times[stop_times['trip_id'] == trip_id]

        # Only keep rows with consecutive stop sequences
        trip_df = trip_df[trip_df['stop_sequence'] == (trip_df.shift(-1)['stop_sequence'] - 1)]

        trip_df = trip_df.rename(columns={
            'stop_num': 'departure_stop'
        })

        trip_df['departure_time'] = trip_df['departure_time'].apply(normalise_time)
        trip_df['arrival_time'] = trip_df['arrival_time'].apply(normalise_time)

        trip_df['departure_time'] = pd.to_datetime(trip_df['departure_time'])

        trip_df.loc[:, 'arrival_stop'] = trip_df.shift(-1).loc[:, 'departure_stop']
        trip_df.loc[:, 'arrival_time'] = pd.to_datetime(trip_df.shift(-1).loc[:, 'arrival_time'])
        trip_df = trip_df[:-1]
        trip_df['departure_stop'] = trip_df['departure_stop'].astype(int)
        trip_df['arrival_stop'] = trip_df['arrival_stop'].astype(int)
        trip_df['expected_travel_time'] = (trip_df['arrival_time']
                                            - trip_df['departure_time']).dt.total_seconds()

        stop_pairs.append(trip_df)

    cols = ['departure_stop', 'arrival_stop', 'route_short_name', 'arrival_time',
            'departure_time', 'expected_travel_time']
    stop_pairs_2021_df = pd.concat(stop_pairs)[cols].drop_duplicates()
    stop_pairs_2021_df['stop_pair'] = stop_pairs_2021_df.apply(lambda row:
                                            f"{row['departure_stop']}_to_{row['arrival_stop']}",
                                            axis=1
                                            )
    stop_pairs_2021_df.to_csv(
       '/home/team13/UCD-DublinBus/backend/model_output/timetable/stop_pairs_2021.csv',
       index=False
    )
    os.system("rm *.zip")

conn = sqlite3.connect("/home/team13/db/database/DublinBusHistoric_typed.db")

# Routes
routes_2018 = set(pd.read_sql("SELECT DISTINCT LINEID FROM trips", conn)['LINEID'].str.upper())
routes_2021 = set(pd.read_csv(
                                'routes.txt',
                                usecols=['route_short_name']
                            )['route_short_name'].str.upper())
logging.info(f"Routes in 2018: {len(routes_2018)}")
logging.info(f"Routes in 2021: {len(routes_2021)}")
logging.info(f"Number of routes in 2018 not in 2021: {len(set(routes_2018) - set(routes_2021))}")
logging.info(f"Number of routes in 2021 not in 2018: {len(set(routes_2021) - set(routes_2018))}")
new_routes_2021 = set(routes_2021) - set(routes_2018)
logging.info(new_routes_2021)

# Stops
stop_pairs_2021_df = pd.read_csv(
                    '/home/team13/UCD-DublinBus/backend/model_output/timetable/stop_pairs_2021.csv'
                    )
stops_2021 = set(stop_pairs_2021_df['departure_stop'].tolist() + stop_pairs_2021_df['arrival_stop'])

stop_pairs_2018 = []
for stop_pair_file in glob.glob("/home/team13/data/adjacent_stop_pairs_with_features/*"):
    stop_pair = stop_pair_file.split('/')[-1].split('.')[0]
    stop_pairs_2018.append(stop_pair)

logging.info(f"Number of stop pairs in 2018: {len(set(stop_pairs_2018))}")
logging.info(f"Number of stop pairs in 2021: {len(set(stop_pairs_2021_df['stop_pair']))}")

stop_pair_diff = set(stop_pairs_2021_df['stop_pair']) - set(stop_pairs_2018)
logging.info(f"Number of stop pairs in 2021 not in 2018: {len(stop_pair_diff)}")
logging.info(stop_pair_diff)

new_stop_pairs_2021 = stop_pairs_2021_df[
                        stop_pairs_2021_df['route_short_name'].str.upper().isin(new_routes_2021)
                        ]['stop_pair']

logging.info("Stop Pairs in 2021 but not in 2018")
logging.info(stop_pairs_2021_df[stop_pairs_2021_df['stop_pair'].isin(list(stop_pair_diff))])
logging.info(stop_pairs_2021_df[stop_pairs_2021_df['stop_pair'].isin(list(stop_pair_diff))].shape)

logging.info("Stop Pairs in 2021 but not in 2018 which are from new routes")
logging.info(
    stop_pairs_2021_df[(stop_pairs_2021_df['stop_pair'].isin(stop_pair_diff))
                        & (stop_pairs_2021_df['route_short_name'].isin(new_routes_2021))]
)

logging.info("Stop Pairs in 2021 but not in 2018 which are not from new routes")
logging.info(
    stop_pairs_2021_df[(stop_pairs_2021_df['stop_pair'].isin(stop_pair_diff))
                        & ~stop_pairs_2021_df['route_short_name'].isin(new_routes_2021)]
)
logging.info(
    stop_pairs_2021_df[(stop_pairs_2021_df['stop_pair'].isin(stop_pair_diff))
                        & ~stop_pairs_2021_df['route_short_name'].isin(new_routes_2021)
                        ]['route_short_name'].unique()
)
