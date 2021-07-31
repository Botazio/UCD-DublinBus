import datetime
import argparse

from .utils import train_all_stop_pair_models

# Command line argument to turn on downloading of new data
parser = argparse.ArgumentParser()
parser.add_argument('--grid_search', help="Perform Grid Search", action="store_true")
args = parser.parse_args()

current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")

if args.grid_search:
    train_all_stop_pair_models("NeuralNetwork", grid_search=True)
else:
    train_all_stop_pair_models("NeuralNetwork", grid_search=False)
