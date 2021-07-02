import glob
import logging
import pickle
import datetime
import pandas as pd

logging.basicConfig(
    filename=f"/home/team13/logs/models/historical_averages/{datetime.datetime.now()}",
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)

historical_avgs = {}

for stop_pair in glob.glob("/home/team13/data/adjacent_stop_pairs_with_features/*"):

    stop_pair_df = pd.read_csv(stop_pair)

    stop_pair = stop_pair.split("/")[-1].split('.')[0]

    logging.info(
        f"{stop_pair_df.shape[0]} rows for {stop_pair.split('/')[-1]}")

    historical_avgs[stop_pair] = stop_pair_df['TRAVEL_TIME'].mean()

with open(
    '/home/team13/model_output/historical_averages' +
        f'/historical_averages_{datetime.datetime.now()}.pickle',
        'wb') as pickle_file:
    pickle.dump(historical_avgs, pickle_file)
