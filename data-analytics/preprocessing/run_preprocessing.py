"""
Run preprocessing on the data using this script. The preprocessing is broken up into two stages.

1. Matching Adjacent Pairs of Stops: This step matches up pairs of adjacent stops
for each day in the 2018 data and saves them as separate parquet files.

    nohup python -u -m preprocessing.run_preprocessing create_adjacent_stop_pairs &

It saves the output to /home/team13/data/adjacent_stop_pairs/. Timestampted logs are available in
/home/team13/logs/preprocessing/.

2. Feature Engineering: This stage takes the input of the previous stage and combines all the
CSVs files for a particular stop pair together and adds features.

    nohup python -u -m preprocessing.run_preprocessing features &

It saves the output to /home/team13/data/adjacent_stop_pairs_with_features/.
Timestampted logs are available in /home/team13/logs/preprocessing/.
"""

import sqlite3
import os
import datetime
import logging
import sys
import glob
import pandas as pd
import numpy as np
from .utils import create_adjacent_stop_pairs, bank_holidays_2018

logging.basicConfig(
    filename=f"/home/team13/logs/preprocessing/{sys.argv[1]}_{datetime.datetime.now()}",
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)

if sys.argv[1] == "create_adjacent_stop_pairs":

    conn = sqlite3.connect("/home/team13/db/database/DublinBusHistoric1.db")

    dates = pd.read_sql("SELECT DISTINCT DAYOFSERVICE FROM trips", conn)
    dates = pd.to_datetime(dates['DAYOFSERVICE'], format="%d-%b-%y %H:%M:%S")

    for date in dates:
        logging.info(f"Creating adjacent pairs for {date}")

        query_date = date.strftime("%d-%b-%y %H:%M:%S").upper()

        LEAVTIMES_QUERY = """
        select TRIPID, PROGRNUMBER, STOPPOINTID, ACTUALTIME_ARR, ACTUALTIME_DEP
        from leavetimes
        WHERE DAYOFSERVICE == "{query_date}"
        """

        TRIPS_QUERY = """
        select DAYOFSERVICE, TRIPID, LINEID, ROUTEID, DIRECTION
        from trips
        WHERE DAYOFSERVICE == "{query_date}"
        """

        leavetimes = pd.read_sql(
            LEAVTIMES_QUERY.format(query_date=query_date), conn)
        trips = pd.read_sql(TRIPS_QUERY.format(query_date=query_date), conn)

        # Data quality checks
        # Remove any rows from leavetimes where the ACTUALTIME_ARR is greater than
        # the ACTUALTIME_DEP (i.e., a bus cannot arrive at a stop after it's
        # already supposed to have departed)
        leavetimes = leavetimes[leavetimes['ACTUALTIME_ARR'] <= leavetimes['ACTUALTIME_DEP']]

        # Join leavetimes and trips
        leavetimes_trips = leavetimes.join(
            trips.set_index('TRIPID'), on='TRIPID')

        stop_pairs_df = create_adjacent_stop_pairs(leavetimes_trips)

        for dep_stop, arr_stop in list(
                stop_pairs_df.groupby(['DEPARTURE_STOP', 'ARRIVAL_STOP'])[
                    ['TRAVEL_TIME']].mean().index
        ):
            res = stop_pairs_df[(stop_pairs_df['DEPARTURE_STOP'] == dep_stop) & (
                stop_pairs_df['ARRIVAL_STOP'] == arr_stop)]

            path = f"/home/team13/data/adjacent_stop_pairs/{int(dep_stop)}_to_{int(arr_stop)}/"

            if not os.path.exists(path):
                os.mkdir(path)

            file_name = f'{int(dep_stop)}_to_{int(arr_stop)}_{query_date}'
            res.sort_values('TIME_DEPARTURE').to_parquet(
                path + f'{file_name}.parquet', index=False)

elif sys.argv[1] == "features":
    for stop_pair in glob.glob("/home/team13/data/adjacent_stop_pairs/*"):

        dfs = []
        for parquet_file in glob.glob(f"{stop_pair}/*"):
            dfs.append(pd.read_parquet(parquet_file))

        stop_pair = stop_pair.split("/")[-1]

        stop_pair_df = pd.concat(dfs)

        logging.info(f"{stop_pair_df.shape[0]} rows for {stop_pair}")

        # Data quality checks
        if (stop_pair_df[stop_pair_df['TRAVEL_TIME'] < 0].shape[0]) > 0:
            invalid_rows = stop_pair_df[stop_pair_df['TRAVEL_TIME'] < 0].index
            logging.info(f"Dropping {len(invalid_rows)} rows where calculated travel" +
                            "time is < 0")

            stop_pair_df = stop_pair_df.drop(invalid_rows)

        # Add time features
        SECONDS_IN_DAY = 24 * 60 * 60
        stop_pair_df['COS_TIME'] = np.cos(
            stop_pair_df['TIME_DEPARTURE'] * (2 * np.pi / SECONDS_IN_DAY))
        stop_pair_df['SIN_TIME'] = np.sin(
            stop_pair_df['TIME_DEPARTURE'] * (2 * np.pi / SECONDS_IN_DAY))

        stop_pair_df['DAY'] = pd.to_datetime(
            stop_pair_df['DAYOFSERVICE'], format="%d-%b-%y %H:%M:%S").dt.weekday
        stop_pair_df['COS_DAY'] = np.cos(
            stop_pair_df['DAY'] * (2 * np.pi / 7))
        stop_pair_df['SIN_DAY'] = np.sin(
            stop_pair_df['DAY'] * (2 * np.pi / 7))

        # Add weather features
        weather_df = pd.read_csv(
            "~/data/raw/met_eireann_hourly_phoenixpark_jan2018jan2019.csv",
            usecols=['date', 'rain', 'temp'])
        weather_df['date'] = pd.to_datetime(
            weather_df['date'].str.upper(), format="%d-%b-%Y %H:%M")
        weather_df['DATE'] = weather_df['date'].dt.date
        weather_df['HOUR'] = weather_df['date'].dt.hour

        stop_pair_df['DAYOFSERVICE'] = pd.to_datetime(
            stop_pair_df['DAYOFSERVICE'], format="%d-%b-%y %H:%M:%S")
        stop_pair_df['DATE'] = stop_pair_df['DAYOFSERVICE'].dt.date
        stop_pair_df['HOUR'] = stop_pair_df['DAYOFSERVICE'].dt.hour

        stop_pair_df = pd.merge(stop_pair_df, weather_df, on=[
                                'DATE', 'HOUR'], how='left')
        file_path = f"/home/team13/data/adjacent_stop_pairs_with_features/{stop_pair}.parquet"

        # bank holiday features
        stop_pair_df['BANK_HOLIDAY'] = 0
        stop_pair_df.loc[stop_pair_df['DAYOFSERVICE'].isin(bank_holidays_2018), 'BANK_HOLIDAY'] = 1

        stop_pair_df.sort_values(['DAYOFSERVICE', 'TIME_DEPARTURE']).to_parquet(
            file_path, index=False)
