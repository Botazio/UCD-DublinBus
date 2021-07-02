import datetime
import glob
import logging
import pickle

import pandas as pd
from sklearn.linear_model import LinearRegression

logging.basicConfig(
    filename=f"/home/team13/logs/models/linear_regression/{datetime.datetime.now()}",
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)

linear_regression = {}

for stop_pair in glob.glob("/home/team13/data/adjacent_stop_pairs_with_features/*"):

    stop_pair_df = pd.read_csv(stop_pair)

    logging.info(
        f"{stop_pair_df.shape[0]} rows for {stop_pair.split('/')[-1]}")

    if stop_pair_df.shape[0] < 50:
        y = stop_pair_df['TRAVEL_TIME']
        X = stop_pair_df[['COS_TIME', 'SIN_TIME', 'COS_DAY', 'SIN_DAY']]

        reg = LinearRegression().fit(X, y)

        linear_regression[stop_pair] = reg

with open(
    "/home/team13/model_output/linear_regression" +
        f"/linear_regression_{datetime.datetime.now()}.pickle",
        'wb') as pickle_file:
    pickle.dump(linear_regression, pickle_file)
