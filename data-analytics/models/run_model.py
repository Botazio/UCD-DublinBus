import logging
import sys
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression

from .utils import train_all_stop_pair_models, generate_learning_curve

model_lookup = {
    "linear-regression": LinearRegression(),
    "random-forest": RandomForestRegressor(),
}

if len(sys.argv) < 1:
    logging.error("No command line arguments passed." +
                    "Please choose either 'train' or 'learning-curve'")
    sys.exit()

model = model_lookup[sys.argv[1]]
mode = sys.argv[2]

if mode == "train":
    train_all_stop_pair_models(model)
elif mode == "learning-curve":
    stop_pair = sys.argv[3]
    generate_learning_curve(model, stop_pair)