import argparse

from .utils import train_all_stop_pair_models

# Command line argument to turn on downloading of new data
parser = argparse.ArgumentParser()
parser.add_argument('--grid_search', help="Perform Grid Search", action="store_true")
parser.add_argument('--start_num', type=int)
parser.add_argument('--end_num', type=int)
parser.add_argument('--stop_pair', type=str)
args = parser.parse_args()

if args.grid_search:
    train_all_stop_pair_models("NeuralNetwork", grid_search=True)
else:
    train_all_stop_pair_models(
        "NeuralNetwork",
        grid_search=False,
        start_num=0 if not args.start_num else args.start_num,
        end_num=args.end_num,
        stop_pair=args.stop_pair
    )
