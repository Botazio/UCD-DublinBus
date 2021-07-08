import datetime
import glob
import logging
import pickle

import pandas as pd
from sklearn.model_selection import TimeSeriesSplit, train_test_split
from sklearn.metrics import mean_squared_error

def train_stop_pairs_models(model):
    """
    Train a model on each adjacent stop pair

    Args
    ---
        model: sklearn model instance
            A model from scikit-learn (e.g., LinearRegression()
    """

    model_name = type(model).__name__

    logging.basicConfig(
        filename=f"/home/team13/logs/models/{model_name}/{datetime.datetime.now()}",
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=logging.INFO,
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    trained_models = {}
    stop_pairs_metrics = []

    # Train a model for each adjacent stop pair
    for stop_pair in glob.glob("/home/team13/data/adjacent_stop_pairs_with_features/*"):

        stop_pair_df = pd.read_parquet(stop_pair).sort_values(['DAYOFSERVICE', 'TIME_ARRIVAL'])
        metrics = {
            'stop_pair': stop_pair.split('/')[-1],
            'num_rows': stop_pair_df.shape[0]
        }

        logging.info(
            f"{stop_pair_df.shape[0]} rows for {stop_pair.split('/')[-1]}")

        if stop_pair_df.shape[0] > 50:

            model_output = train_model(stop_pair_df, model)

            metrics['average_cv_rmse'] = model_output['average_cv_rmse']
            metrics['test_rmse'] = model_output['test_rmse']

            trained_models[stop_pair] = model_output['trained_model']

    # Write out metrics for each stop pair to CSV
    pd.DataFrame(stop_pairs_metrics).to_csv(f'/home/team13/model_output/{model_name}/' +
        f"/{model_name}_metrics_{datetime.datetime.now()}.csv", index=False)

    # Write out trained models as pickle files
    with open(
        f"/home/team13/model_output/{model_name}/" +
            f"/{model_name}_{datetime.datetime.now()}.pickle",
            'wb') as pickle_file:
        pickle.dump(trained_models, pickle_file)

def train_model(stop_pair_df, model):
    """
    Train a model on one adjacent stop pair

    Args
    ---
        stop_pair_df: DataFrame
            A DataFrame of all the data for a particular adjacent
            stop pair

        model: sklearn model instance

    Returns
    ---
        A dict with:
            'average_cv_rmse': The average RMSE across the 5 folds of
            cross-validation

            'test_rmse': The RMSE on the unseen test set

            'trained_model': The final model trained on the whole
            dataset (train + test)
    """

    y_full = stop_pair_df['TRAVEL_TIME']

    features = ['COS_TIME', 'SIN_TIME', 'COS_DAY', 'SIN_DAY', 'rain',
                'temp', 'BANK_HOLIDAY']
    x_full = stop_pair_df[features]

    x_train, x_test, y_train, y_test = train_test_split(
        x_full,
        y_full,
        test_size=0.20,
        # Don't shuffle because time-series data that's already been sorted
        shuffle=False
    )

    # Perform cross-validation
    average_cv_rmse = time_series_cross_validate(x_train, y_train, model)
    logging.info(f"Average 5-Fold Cross-Validation RMSE: {average_cv_rmse}")

    # Train on full training set now and calculate unseen test set metrics
    predictions = model.fit(x_train, y_train).predict(x_test)
    test_rmse = mean_squared_error(y_test, predictions, squared=False)
    logging.info(f"Unseen Test Set RMSE: {test_rmse}\n")

    # Train on full data (train and test) before finally saving
    trained_model = model.fit(x_full, y_full)

    return {
        'average_cv_rmse': average_cv_rmse,
        'test_rmse': test_rmse,
        'trained_model': trained_model
    }

def time_series_cross_validate(x_train, y_train, model):
    """
    Perform 5-fold cross-validation on the training data with the
    given model and return the average RMSE

    Args
    ---
        x_train: DataFrame
            A DataFrame of features

        y_train: DataFrame
            A DataFrame with the target variable only

    Returns
    ---
    A float for average RMSE across the 5 folds
    """

    # Use TimeSeriesSplit to ensure that we don't have data leakage
    tcsv = TimeSeriesSplit(n_splits=5)
    cv_metrics = []
    for train_cv, test_cv in tcsv.split(x_train):
        fitted_model = model.fit(x_train.iloc[train_cv], y_train.iloc[train_cv])
        predictions = fitted_model.predict(x_train.iloc[test_cv])
        rmse = mean_squared_error(y_train.iloc[test_cv], predictions, squared=False)
        cv_metrics.append(rmse)

    # Return the average RMSE
    return sum(cv_metrics) / len(cv_metrics)
