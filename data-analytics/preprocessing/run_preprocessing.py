"""
Run preprocessing on the data using this script. The preprocessing is broken up into two stages.

1. Matching Adjacent Pairs of Stops: This step matches up pairs of adjacent stops
for each day in the 2018 data and saves them as separate CSV files.

    nohup python -u data-analytics/preprocessing/run_preprocessing.py create_adjacent_stop_pairs &

It saves the output to ~/data/adjacent_stop_pairs/. Timestampted logs are available in 
~/logs/preprocessing/.

2. Feature Engineering: This stage takes the input of the previous stage and combines all the
CSVs files for a particular stop pair together and adds features. 

    nohup python -u data-analytics/preprocessing/run_preprocessing.py features &

It saves the output to ~/data/adjacent_stop_pairs_with_features/. Timestampted logs are available in 
~/logs/preprocessing/.
"""

import sqlite3
import os
import pandas as pd
import numpy as np
import utils
import datetime
import logging
import sys
import glob

logging.basicConfig(
    filename=f"/home/team13/logs/preprocessing/{sys.argv[1]}_{datetime.datetime.now()}",
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)

if sys.argv[1] == "create_adjacent_stop_pairs":

    conn = sqlite3.connect("/home/team13/db/database/DublinBusHistoric1.db")

    query = "SELECT DISTINCT DAYOFSERVICE FROM trips"
    dates = pd.read_sql(query, conn)
    dates = pd.to_datetime(dates['DAYOFSERVICE'], format="%d-%b-%y %H:%M:%S")

    for date in dates:
        logging.info(f"Creating adjacent pairs for {date}")

        query_date = date.strftime("%d-%b-%y %H:%M:%S").upper()

        leavetimes_query = """
        select TRIPID, PROGRNUMBER, STOPPOINTID, ACTUALTIME_ARR, ACTUALTIME_DEP
        from leavetimes
        WHERE DAYOFSERVICE == "{query_date}"
        """

        trips_query = """
        select DAYOFSERVICE, TRIPID, LINEID, ROUTEID, DIRECTION
        from trips
        WHERE DAYOFSERVICE == "{query_date}"
        """

        # Join leavetimes and trips
        RT_Leavetimes = pd.read_sql(
            leavetimes_query.format(query_date=query_date), conn)
        RT_Trips = pd.read_sql(trips_query.format(query_date=query_date), conn)
        leavetimes_trips = RT_Leavetimes.join(
            RT_Trips.set_index('TRIPID'), on='TRIPID')

        stop_pairs_df = utils.create_adjacent_stop_pairs(leavetimes_trips)

        for dep_stop, arr_stop in list(stop_pairs_df.groupby(['DEPARTURE_STOP', 'ARRIVAL_STOP'])[['TRAVEL_TIME']].mean().index):
            res = stop_pairs_df[(stop_pairs_df['DEPARTURE_STOP'] == dep_stop) & (
                stop_pairs_df['ARRIVAL_STOP'] == arr_stop)]

            path = f"/home/team13/data/adjacent_stop_pairs/{int(dep_stop)}_to_{int(arr_stop)}/"

            if not os.path.exists(path):
                os.mkdir(path)

            file_name = f'{int(dep_stop)}_to_{int(arr_stop)}_{query_date}'
            res.sort_values('TIME_DEPARTURE').to_csv(
                path + f'{file_name}.csv', index=False)

elif sys.argv[1] == "features":
    for stop_pair in glob.glob("/home/team13/data/adjacent_stop_pairs/*"):

        logging.info(f"Creating features for {stop_pair.split('/')[-1]}")

        dfs = []
        for c in glob.glob(f"{stop_pair}/*"):
            dfs.append(pd.read_csv(c))

        if len(dfs) > 0:

            stop_pair_df = pd.concat(dfs)

            stop_pair_df['HOUR'] = stop_pair_df['TIME_DEPARTURE'] / (60 * 60)
            seconds_in_day = 24 * 60 * 60
            stop_pair_df['COS_TIME'] = np.cos(
                stop_pair_df['TIME_DEPARTURE'] * (2 * np.pi / seconds_in_day))
            stop_pair_df['SIN_TIME'] = np.sin(
                stop_pair_df['TIME_DEPARTURE'] * (2 * np.pi / seconds_in_day))

            stop_pair_df['DAY'] = pd.to_datetime(
                stop_pair_df['DAYOFSERVICE'], format="%d-%b-%y %H:%M:%S").dt.weekday
            stop_pair_df['COS_DAY'] = np.cos(
                stop_pair_df['DAY'] * (2 * np.pi / 7))
            stop_pair_df['SIN_DAY'] = np.sin(
                stop_pair_df['DAY'] * (2 * np.pi / 7))

            file_path = f"/home/team13/data/adjacent_stop_pairs_with_features/{stop_pair.split('/')[-1]}.csv"

            stop_pair_df.sort_values(['DAYOFSERVICE', 'TIME_DEPARTURE']).to_csv(
                file_path, index=False)
