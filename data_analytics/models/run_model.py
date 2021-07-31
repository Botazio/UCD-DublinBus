"""
Train models on the data using this script. See the README.md for more details.
"""

import logging
import sys
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression

from .utils import train_all_stop_pair_models, generate_learning_fit_time_curves

model_lookup = {
    "linear-regression": LinearRegression(),
    "random-forest": RandomForestRegressor(),
}

if len(sys.argv) < 1:
    logging.error("No command line arguments passed." +
                    "Please choose either 'train' or 'learning-curve'")
    sys.exit()

model_name = sys.argv[1]
model = model_lookup[model_name]
mode = sys.argv[2]

if mode == "train":
    train_all_stop_pair_models(model_name, model=model)
elif mode == "learning-curve":
    stop_pair = sys.argv[3]
    generate_learning_fit_time_curves(model, stop_pair)
