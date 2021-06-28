import glob
import logging
import pandas as pd
import pickle
import datetime

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

    logging.info(f"{stop_pair_df.shape[0]} rows for {stop_pair}")

    historical_avgs[stop_pair] = stop_pair_df['TRAVEL_TIME'].mean()

with open(f'/home/team13/model_output/historical_averages/historical_averages_{datetime.datetime.now()}.pickle', 'wb') as pickle_file:
    pickle.dump(historical_avgs, pickle_file)