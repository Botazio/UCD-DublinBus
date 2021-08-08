"""
Run preprocessing on the data using this script. See the README.md for more details.
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

stop_pairs_2021 = list(pd.read_csv("~/model_output/stop_pairs_2021.csv")['stop_pair'].unique())

if sys.argv[1] == "create_adjacent_stop_pairs":

    conn = sqlite3.connect("/home/team13/db/database/DublinBusHistoric_typed.db")

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
                stop_pairs_df.groupby(['departure_stop', 'arrival_stop'])[
                    ['travel_time']].mean().index
        ):

            if f"{int(dep_stop)}_to_{int(arr_stop)}" in stop_pairs_2021:

                res = stop_pairs_df[(stop_pairs_df['departure_stop'] == dep_stop) & (
                    stop_pairs_df['arrival_stop'] == arr_stop)]

                path = f"/home/team13/data/adjacent_stop_pairs/{int(dep_stop)}_to_{int(arr_stop)}/"

                if not os.path.exists(path):
                    os.mkdir(path)

                file_name = f'{int(dep_stop)}_to_{int(arr_stop)}_{query_date}'
                res.sort_values('time_departure').to_parquet(
                    path + f'{file_name}.parquet', index=False)

elif sys.argv[1] == "features":

    for stop_pair in glob.glob("/home/team13/data/adjacent_stop_pairs/*"):

        dfs = []
        for parquet_file in glob.glob(f"{stop_pair}/*"):
            dfs.append(pd.read_parquet(parquet_file))

        stop_pair = stop_pair.split("/")[-1]

        stop_pair_df = pd.concat(dfs, ignore_index=True)

        logging.info(f"{stop_pair_df.shape[0]} rows for {stop_pair}")

        # Data quality checks
        if (stop_pair_df[stop_pair_df['travel_time'] < 0].shape[0]) > 0:
            invalid_rows = stop_pair_df[stop_pair_df['travel_time'] < 0].index
            logging.info(f"Dropping {len(invalid_rows)} rows where calculated travel" +
                            "time is < 0")

            stop_pair_df = stop_pair_df.drop(invalid_rows)

        # Outlier detection for TRAVEL_TIME
        q25 = np.percentile(stop_pair_df['travel_time'], 25)
        q75 = np.percentile(stop_pair_df['travel_time'], 75)
        iqr = q75 - q25

        cut_off = iqr * 3
        lower, upper = q25 - cut_off, q75 + cut_off
        outliers = stop_pair_df[
                    (stop_pair_df['travel_time'] < lower) |
                        (stop_pair_df['travel_time'] > upper)
                   ]
        outliers_pct = (outliers.shape[0] / stop_pair_df.shape[0])*100
        if outliers.shape[0] > 0:
            logging.info(
                f"Identified {outliers.shape[0]} outliers {outliers_pct:.2f}%"
            )
        # Don't drop outliers if they constitute more than 10% of data
        if outliers_pct < 10:
            logging.info("Dropping outliers because percentage of outliers is below 10%")
            stop_pair_df = stop_pair_df[
                            (stop_pair_df['travel_time'] >= lower) &
                                (stop_pair_df['travel_time'] <= upper)
                           ]
            logging.info(f"{stop_pair_df.shape[0]} remaining rows for {stop_pair}")

        stop_pair_df['DAYOFSERVICE'] = pd.to_datetime(
            stop_pair_df['DAYOFSERVICE'], format="%d-%b-%y %H:%M:%S")
        stop_pair_df['hour'] = (stop_pair_df['time_departure'] / (60 * 60)).astype(int)

        # Dublin Bus data uses hours >= 24 for the next day (e.g., 25:00 for 1am)
        # Move the day of service to the next day and convert hour back to 24hr clock
        stop_pair_df.loc[stop_pair_df['hour'] >= 24,
                            'DAYOFSERVICE'] = stop_pair_df['DAYOFSERVICE'] + pd.Timedelta(days=1)
        stop_pair_df['hour'] = stop_pair_df['hour'] % 24

        stop_pair_df['date'] = stop_pair_df['DAYOFSERVICE'].dt.date
        stop_pair_df['day'] = stop_pair_df['DAYOFSERVICE'].dt.weekday

        # cosine and sine of seconds since midnight
        SECONDS_IN_DAY = 24 * 60 * 60
        stop_pair_df['cos_time'] = np.cos(
            stop_pair_df['time_departure'] * (2 * np.pi / SECONDS_IN_DAY))
        stop_pair_df['sin_time'] = np.sin(
            stop_pair_df['time_departure'] * (2 * np.pi / SECONDS_IN_DAY))

        # cosine and sine of day of week number
        stop_pair_df['cos_day'] = np.cos(
            stop_pair_df['day'] * (2 * np.pi / 7))
        stop_pair_df['sin_day'] = np.sin(
            stop_pair_df['day'] * (2 * np.pi / 7))

        # dummy variable for weekend
        stop_pair_df['is_weekend'] = stop_pair_df['day'].isin([5, 6])

        # one-hot encoding of days and hours
        day_of_week_columns = pd.get_dummies(stop_pair_df['day'], drop_first=True, prefix="day")
        stop_pair_df[list(day_of_week_columns)] = day_of_week_columns

        hour_of_day_columns = pd.get_dummies(stop_pair_df['hour'], drop_first=True, prefix='hour')
        stop_pair_df[list(hour_of_day_columns)] = hour_of_day_columns

        stop_pair_df = stop_pair_df.drop('DAYOFSERVICE', axis=1)

        # Add weather features
        weather_df = pd.read_csv(
            "~/data/raw/met_eireann_hourly_phoenixpark_dec2017jan2019.csv",
            usecols=['date', 'rain', 'temp'])
        weather_df['datetime'] = pd.to_datetime(
            weather_df['date'].str.upper(), format="%d-%b-%Y %H:%M")
        weather_df = weather_df.drop('date', axis=1)
        weather_df['date'] = weather_df['datetime'].dt.date
        weather_df['hour'] = weather_df['datetime'].dt.hour
        weather_df = weather_df.sort_values('datetime')
        weather_df['lagged_rain'] = weather_df['rain'].shift(1)

        stop_pair_df = pd.merge(stop_pair_df, weather_df, on=[
                                'date', 'hour'], how='left')
        file_path = f"/home/team13/data/adjacent_stop_pairs_with_features/{stop_pair}.parquet"

        # bank holiday features
        stop_pair_df['bank_holiday'] = 0
        stop_pair_df.loc[stop_pair_df['date'].isin(bank_holidays_2018), 'bank_holiday'] = 1

        stop_pair_df.sort_values(['date', 'time_departure']).to_parquet(
            file_path, index=False)
