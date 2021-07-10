import datetime
import glob
import logging
import pickle

import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit, train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import learning_curve

sns.set_theme()

def train_all_stop_pair_models(model):
    """
    Train a model on each adjacent stop pair

    Args
    ---
        model: sklearn model instance
            A model from scikit-learn (e.g., LinearRegression())
    """

    current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
    model_name = type(model).__name__

    logging.basicConfig(
        filename=f"/home/team13/logs/models/{model_name}/{current_time}",
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=logging.INFO,
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    trained_models = {}
    stop_pairs_metrics = []

    # Train a model for each adjacent stop pair
    for stop_pair in glob.glob("/home/team13/data/adjacent_stop_pairs_with_features/*"):

        stop_pair_df = pd.read_parquet(stop_pair).sort_values(['date', 'time_arrival'])
        metrics = {
            'stop_pair': stop_pair.split('/')[-1],
            'num_rows': stop_pair_df.shape[0]
        }

        logging.info(
            f"{stop_pair_df.shape[0]} rows for {stop_pair.split('/')[-1]}")

        if stop_pair_df.shape[0] > 50:

            # Train model
            average_cv_rmse, test_rmse, trained_model = train_model(stop_pair_df, model)

            # Add metrics for this stop pair
            metrics['average_cv_rmse'] = average_cv_rmse
            metrics['test_rmse'] = test_rmse
            stop_pairs_metrics.append(metrics)

            # Add trained model to dict
            trained_models[stop_pair.split('/')[-1]] = trained_model

    logging.info(
        "Model training complete. Writing out metrics and pickle files for each" +
            "stop pair"
    )

    # Save plot of RMSE against number of rows for each stop pair
    plot_stop_pairs_metrics(pd.DataFrame(stop_pairs_metrics), model_name, current_time)

    # Write out metrics for each stop pair to CSV
    pd.DataFrame(stop_pairs_metrics).to_csv(f'/home/team13/model_output/{model_name}/' +
        f"/{model_name}_metrics_{current_time}.csv", index=False)

    # Write out trained models as pickle files
    with open(
        f"/home/team13/model_output/{model_name}/" +
            f"/{model_name}_{current_time}.pickle",
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

    y_full = stop_pair_df['travel_time']

    features = ['cos_time', 'sin_time', 'cos_day', 'sin_day', 'rain',
                'lagged_rain', 'temp', 'bank_holiday']
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

    return average_cv_rmse, test_rmse, trained_model

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

def plot_stop_pairs_metrics(stop_pairs_metrics, model_name, current_time):
    """
    Plot the RMSE from cross-validation and from the test set as a scatter
    plot against the number of rows for each stop pair.

    Args
    ---
        stop_pairs_metrics: DataFrame
            A DataFrame with one row for each stop pair and columns
            for each of the metrics to plot and the number of rows

        model_name: str
            The name of the model that was used to generate these
            statistics

        current_time: str
            The time these statistics were generated to use in the
            file name

    Returns
    ---
        Saves a scatter plot
    """

    _, axes = plt.subplots(1, 2, figsize=(20, 5))

    axes[0].plot(
        stop_pairs_metrics['num_rows'],
        stop_pairs_metrics['average_cv_rmse'],
        'o'
    )
    axes[0].legend(loc="best")
    axes[0].set_title("Average CV RMSE vs. Number of Rows per Stop Pair")
    axes[0].set_xlabel("Number of Rows")
    axes[0].set_ylabel("RMSE")

    axes[1].plot(
        stop_pairs_metrics['num_rows'],
        stop_pairs_metrics['test_rmse'],
        'o'
    )
    axes[1].legend(loc="best")
    axes[1].set_title("Test RMSE vs. Number of Rows per Stop Pair")
    axes[1].set_xlabel("Number of Rows")
    axes[1].set_ylabel("RMSE")

    plt.savefig(f"/home/team13/model_output/{model_name}/" +
        f"{model_name}_metrics_{current_time}.png")

def generate_learning_fit_time_curves(model, stop_pair, current_time):
    """
    Plot learning and fit time curves for a model for a particular stop pair. The
    final plot consists of three plots:
        1. Learning curve for training and cross-validation
        2. Plot of fit times vs. number of samples
        3. Plot of fit times vs. cross-validation score

    Args
    ---
        model: sklearn model object
            The model to use in the learning curve

        stop_pair: str
            The name of the stop pair to plot a learning curve
            for. In the format "X_to_Y" where X and Y are station
            numbers

        current_time: str
            The time these statistics were generated to use in the
            file name

    Returns
    ---
    Saves a learning curve plot for a stop pair
    """

    stop_pair_df = pd.read_parquet(
        f"/home/team13/data/adjacent_stop_pairs_with_features/{stop_pair}.parquet"
    )

    y_full = stop_pair_df['TRAVEL_TIME']
    features = ['cos_time', 'sin_time', 'cos_day', 'sin_day', 'rain',
                'lagged_rain', 'temp', 'bank_holiday']
    x_full = stop_pair_df[features]

    train_sizes, train_scores, cv_scores, fit_times, _ = learning_curve(
        model,
        x_full,
        y_full,
        cv=5,
        # It seems that only negative RMSE is available
        # Higher score is better in this case (less negative)
        scoring='neg_root_mean_squared_error',
        return_times=True,
        train_sizes=np.linspace(0.1, 1.0, 10)
    )

    _, axes = plt.subplots(1, 3, figsize=(20, 5))

    plot_learning_curve(train_scores, cv_scores, train_sizes, axes)
    plot_fit_time_curves(fit_times, cv_scores, train_sizes, axes)

    model_name = type(model).__name__
    plt.savefig(f"/home/team13/model_output/{model_name}/learning_curves/" +
        f"{model_name}_learning_curve_{stop_pair}_{current_time}.png")

def plot_learning_curve(train_scores, cv_scores, train_sizes, axes):
    """
    Plot a learning curve for training and cross-validation scores

    Args
    ---
        train_scores: np.array
            An array of training scores for each sample size

        cv_scores: np.array
            An array of cross-validation test set scores for each sample
            size

        train_sizes: np.array
            An array of sample sizes

        axes: matplotlib axes
            An axes to plot on

    """

    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    cv_scores_mean = np.mean(cv_scores, axis=1)
    cv_scores_std = np.std(cv_scores, axis=1)

    logging.info(f"Training Scores\n{train_scores}")
    logging.info(f"Training Scores Mean\n{train_scores_mean}")
    logging.info(f"CV Scores\n{cv_scores}")
    logging.info(f"CV Scores Mean\n{cv_scores_mean}")

    axes[0].grid()
    axes[0].fill_between(train_sizes, train_scores_mean - train_scores_std,
                         train_scores_mean + train_scores_std, alpha=0.1,
                         color="r")
    axes[0].fill_between(train_sizes, cv_scores_mean - cv_scores_std,
                         cv_scores_mean + cv_scores_std, alpha=0.1,
                         color="g")
    axes[0].plot(train_sizes, train_scores_mean, 'o-', color="r",
                 label="Training score")
    axes[0].plot(train_sizes, cv_scores_mean, 'o-', color="g",
                 label="Cross-validation score")
    axes[0].legend(loc="best")
    axes[0].set_xlabel("Training Examples")
    axes[0].set_ylabel("Negative RMSE")

def plot_fit_time_curves(fit_times, cv_scores, train_sizes, axes):
    """
    Plot fit time curves for number of samples and cross-validation
    scores

    Args
    ---
        fit_times: np.array
            Time taken to fit a model for a given sample size

        cv_scores: np.array
            An array of cross-validation test set scores for each sample
            size

        train_sizes: np.array
            An array of sample sizes

        axes: matplotlib axes
            An axes to plot on

    """

    fit_times_mean = np.mean(fit_times, axis=1)
    fit_times_std = np.std(fit_times, axis=1)
    cv_scores_mean = np.mean(cv_scores, axis=1)
    cv_scores_std = np.std(cv_scores, axis=1)

    # Plot n_samples vs fit_times
    axes[1].grid()
    axes[1].plot(train_sizes, fit_times_mean, 'o-')
    axes[1].fill_between(train_sizes, fit_times_mean - fit_times_std,
                         fit_times_mean + fit_times_std, alpha=0.1)
    axes[1].set_xlabel("Training examples")
    axes[1].set_ylabel("fit_times")
    axes[1].set_title("Scalability of the model")

    # Plot fit_time vs test score
    axes[2].grid()
    axes[2].plot(fit_times_mean, cv_scores_mean, 'o-')
    axes[2].fill_between(fit_times_mean, cv_scores_mean - cv_scores_std,
                         cv_scores_mean + cv_scores_std, alpha=0.1)
    axes[2].set_xlabel("fit_times")
    axes[2].set_ylabel("Score")
    axes[2].set_title("Cross-Validation Score (Negative RMSE)")
