import datetime
import glob
import logging
import pickle
import math

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import TimeSeriesSplit, train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import learning_curve
from sklearn.model_selection import GridSearchCV
import keras
from keras.layers import Dense, Dropout
from keras.wrappers.scikit_learn import KerasRegressor
from tensorflow.keras.layers.experimental.preprocessing import Normalization

sns.set_theme()

def train_all_stop_pair_models(model_name, model=None, grid_search=False, start_num=0,
                                end_num=None, stop_pair=None):
    """
    Train a model on each adjacent stop pair

    Args
    ---
        model: sklearn model instance
            A model from scikit-learn (e.g., LinearRegression())
    """

    current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")

    logging.basicConfig(
        filename=f"/home/team13/logs/models/{model_name}/{current_time}",
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=logging.INFO,
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    logging.info(current_time)

    stop_pairs_metrics = []

    if stop_pair:

        stop_pair_df = pd.read_parquet(
            f"/home/team13/data/adjacent_stop_pairs_with_features/{stop_pair}.parquet"
        ).sort_values(['date', 'time_arrival'])

        logging.info(
            f"{stop_pair_df.shape[0]} rows for {stop_pair}"
        )

        if stop_pair_df.shape[0] > 50:

            # Train model
            metrics, final_model = train_model(
                                        stop_pair_df,
                                        model,
                                        grid_search=grid_search
                                    )

            metrics['stop_pair'] = stop_pair
            metrics['num_rows'] = stop_pair_df.shape[0]

            # Add metrics for this stop pair
            stop_pairs_metrics.append(metrics)

            if model_name != "NeuralNetwork":
                # Write out trained models as pickle files
                with open(
                    f"/home/team13/model_output/{model_name}/" +
                        f"/trained_models/{stop_pair}.pickle",
                        'wb') as pickle_file:
                    pickle.dump(final_model, pickle_file)

    else:

        stop_pair_files = glob.glob("/home/team13/data/adjacent_stop_pairs_with_features/*")
        if not end_num:
            end_num = len(stop_pair_files)

        logging.info(f"Running models from {start_num} to {end_num}")

        # Train a model for each adjacent stop pair
        for stop_pair_file in stop_pair_files[start_num:end_num]:

            stop_pair_df = pd.read_parquet(stop_pair_file).sort_values(['date', 'time_arrival'])

            stop_pair = stop_pair_file.split('/')[-1].split('.')[0]

            logging.info(
                f"{stop_pair_df.shape[0]} rows for {stop_pair}"
            )

            if stop_pair_df.shape[0] > 50:

                # Train model
                metrics, final_model = train_model(
                                            stop_pair_df,
                                            model,
                                            grid_search=grid_search
                                        )

                metrics['stop_pair'] = stop_pair
                metrics['num_rows'] = stop_pair_df.shape[0]

                # Add metrics for this stop pair
                stop_pairs_metrics.append(metrics)

                if model_name != "NeuralNetwork":
                    # Write out trained models as pickle files
                    with open(
                        f"/home/team13/model_output/{model_name}/" +
                            f"/trained_models/{stop_pair}.pickle",
                            'wb') as pickle_file:
                        pickle.dump(final_model, pickle_file)
                else:
                    final_model.save(f"/home/team13/model_output/{model_name}/" +
                            f"/trained_models/{stop_pair}")

    logging.info(
        "Model training complete. Writing out metrics and pickle files for each" +
            "stop pair"
    )

    # Save plot of RMSE against number of rows for each stop pair
    plot_stop_pairs_metrics(
        pd.DataFrame(stop_pairs_metrics), model_name, current_time, start_num, end_num
    )

    # Write out metrics for each stop pair to CSV
    pd.DataFrame(stop_pairs_metrics).to_csv(f'/home/team13/model_output/{model_name}/' +
        f"/{model_name}_metrics_{current_time}_start={start_num}_end={end_num}.csv", index=False)


def train_model(stop_pair_df, model, grid_search):
    """
    Train a model on one adjacent stop pair

    Args
    ---
        stop_pair_df: DataFrame
            A DataFrame of all the data for a particular adjacent
            stop pair

        model: sklearn model instance

        grid_search: bool
            If True peform grid search. This operation is very time
            consuming because it involves searching through many
            parameters

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

    x_full = stop_pair_df[
        ['cos_time', 'sin_time', 'cos_day', 'sin_day', 'rain',
         'lagged_rain', 'temp', 'bank_holiday']
    ]

    x_train, x_test, y_train, y_test = train_test_split(
        x_full,
        y_full,
        test_size=0.10,
        # Don't shuffle because time-series data that's already been sorted
        shuffle=False
    )

    # default to keras NN if no sklearn model is passed
    if model is None:

        normalizer = Normalization(axis=-1)
        normalizer.adapt(x_train)

        # Perform grid search (very slow)
        if grid_search:

            final_model, average_cv_rmse, grid_result = perform_nn_grid_search(
                x_train,
                y_train,
                normalizer
            )

            # Fit on full training set and get unseen test scores
            final_model.fit(
                x_train.to_numpy(),
                y_train.to_numpy(),
                epochs=grid_result.best_params_['epochs']
            )

            metrics = {
                'average_cv_rmse': average_cv_rmse,
                'test_rmse': math.sqrt(
                                final_model.evaluate(
                                    x_test.to_numpy(),
                                    y_test.to_numpy()
                                )
                            )
            }
            logging.info(f"Unseen Test RMSE: {metrics['test_rmse']}")

        # Skip grid search and use best known parameters from previous grid search
        else:

            # Create a default model
            final_model = create_keras_model(
                # parameters are chosen from previous grid search
                dropout_rate=0.2,
                neurons_layer_1=10,
                neurons_layer_2=15,
                normalizer=normalizer
            )
            final_model.summary(print_fn=logging.info)

            # Get training RMSE (not cross-validated)
            results = final_model.fit(x_train.to_numpy(), y_train.to_numpy(), epochs=15)
            metrics = {
                'average_cv_rmse': math.sqrt(results.history['loss'][-1]),
                'test_rmse': math.sqrt(
                                final_model.evaluate(
                                    x_test.to_numpy(),
                                    y_test.to_numpy()
                                )
                            )
            }

            logging.info(
                f"Training RMSE: {metrics['average_cv_rmse']}"
            )
            logging.info(f"Unseen Test RMSE: {metrics['test_rmse']}")

        # Finally fit on all data and save
        final_model.fit(
            x_full.to_numpy(),
            y_full.to_numpy(),
            epochs=15 if not grid_search else grid_result.best_params_['epochs']
        )

    # otherwise we're using a simple sklearn model (e.g., linear regression)
    else:

        metrics = {
            # Perform cross-validation
            'average_cv_rmse': time_series_cross_validate(x_train, y_train, model),
            # Train on full training set now and calculate unseen test set metrics
            'test_rmse': mean_squared_error(
                            y_test,
                            model.fit(x_train, y_train).predict(x_test),
                            squared=False
                        )
        }

        logging.info(
            f"Training RMSE: {metrics['average_cv_rmse']}"
        )
        logging.info(f"Average 5-Fold Cross-Validation RMSE: {metrics['average_cv_rmse']}")
        logging.info(f"Unseen Test RMSE: {metrics['test_rmse']}")

        # Train on full data (train and test) before finally saving
        final_model = model.fit(x_full, y_full)

    return metrics, final_model

def create_keras_model(dropout_rate, neurons_layer_1, neurons_layer_2, normalizer=None):
    """
    Function to create a simple two hidden layer neural network
    model using keras

    Args
    ---
        dropout_rate: float between 0 and 1
            The dropout rate for neurons in the hidden layer

        neurons_layer_1: int
            The number of neurons in the first hidden layer

        neurons_layer_2: int
            The number of neurons in the second hidden lyear

        normalizer: A normalization layer

    Returns
    ---
    A compile keras model ready for fitting
    """

    if not normalizer:
        normalizer = Normalization(axis=-1)

    inputs = keras.Input(shape=(8,))
    normalizer_layer = normalizer(inputs)
    hidden_layer_1 = Dense(neurons_layer_1, activation='relu')(normalizer_layer)
    dropout_layer_1 = Dropout(dropout_rate)(hidden_layer_1, training=True)
    hidden_layer_2 = Dense(neurons_layer_2, activation='relu')(dropout_layer_1)
    dropout_layer_2 = Dropout(dropout_rate)(hidden_layer_2, training=True)

    outputs = Dense(8)(dropout_layer_2)
    model = keras.Model(inputs, outputs)
    model.compile(loss='mse', optimizer='adam')

    return model

def perform_nn_grid_search(x_train, y_train, normalizer):
    """
    Perform grid search over a range of parameters on a keras neural
    network model

    Args
    ---
        x_train: DataFrame
            Features from the training set

        y_train: DataFrame
            Targets from the training set

        normalizer: Normalization layer

    """

    nn_model = KerasRegressor(build_fn=create_keras_model, verbose=0)

    # define the grid search parameters
    epochs = [5, 10, 15]
    dropout_rate = [0.2, 0.4, 0.6, 0.8]
    neurons_layer_1 = [5, 10, 15]
    neurons_layer_2 = [5, 10, 15]
    param_grid = dict(
        epochs=epochs,
        dropout_rate=dropout_rate,
        neurons_layer_1=neurons_layer_1,
        neurons_layer_2=neurons_layer_2
    )
    grid = GridSearchCV(
        estimator=nn_model,
        param_grid=param_grid,
        n_jobs=-1,
        cv=3
    )
    grid_result = grid.fit(x_train.to_numpy(), y_train.to_numpy())

    # summarize results
    logging.info(
        f"Best: {math.sqrt(abs(grid_result.best_score_))} using {grid_result.best_params_}"
    )

    # Average CV RMSE is the best of out the grid search
    average_cv_rmse = grid_result.best_score_
    logging.info(f"Average CV RMSE: {math.sqrt(abs(average_cv_rmse))}")

    # Create model with best parameters
    final_model = create_keras_model(
        normalizer=normalizer,
        dropout_rate=grid_result.best_params_['dropout_rate'],
        neurons_layer_1=grid_result.best_params_['neurons_layer_1'],
        neurons_layer_2=grid_result.best_params_['neurons_layer_2']
    )
    final_model.summary(print_fn=logging.info)

    return final_model, average_cv_rmse, grid_result

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

def plot_stop_pairs_metrics(stop_pairs_metrics, model_name, current_time, start_num, end_num):
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
    axes[0].set_title("Average CV RMSE vs. Number of Training Rows per Stop Pair")
    axes[0].set_xlabel("Number of Training Rows")
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
        f"{model_name}_metrics_{current_time}_start={start_num}_end={end_num}.png")

def generate_learning_fit_time_curves(model, stop_pair):
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

    Returns
    ---
    Saves a learning curve plot for a stop pair
    """

    current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")

    stop_pair_df = pd.read_parquet(
        f"/home/team13/data/adjacent_stop_pairs_with_features/{stop_pair}.parquet"
    )

    y_full = stop_pair_df['travel_time']
    features = ['cos_time', 'sin_time', 'cos_day', 'sin_day', 'rain',
                'lagged_rain', 'temp', 'bank_holiday']
    x_full = stop_pair_df[features]

    train_sizes, train_scores, cv_scores, _ = learning_curve(
        model,
        x_full,
        y_full,
        cv=5,
        # It seems that only negative RMSE is available
        # Higher score is better in this case (less negative)
        scoring='neg_root_mean_squared_error',
        train_sizes=np.linspace(0.01, 1.0, 30),
        shuffle=False
    )

    _, axes = plt.subplots(1, 1, figsize=(20, 5))

    plot_learning_curve(train_scores, cv_scores, train_sizes, axes)
    # plot_fit_time_curves(fit_times, cv_scores, train_sizes, axes)

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

    print(f"Train Sizes {train_sizes}")
    print(f"Training Scores Mean\n{train_scores_mean}")
    print(f"CV Scores Mean\n{cv_scores_mean}")

    axes.grid()
    axes.fill_between(train_sizes, train_scores_mean - train_scores_std,
                         train_scores_mean + train_scores_std, alpha=0.1,
                         color="r")
    axes.fill_between(train_sizes, cv_scores_mean - cv_scores_std,
                         cv_scores_mean + cv_scores_std, alpha=0.1,
                         color="g")
    axes.plot(train_sizes, train_scores_mean, 'o-', color="r",
                 label="Training score")
    axes.plot(train_sizes, cv_scores_mean, 'o-', color="g",
                 label="Cross-validation score")
    axes.legend(loc="best")
    axes.set_xlabel("Training Examples")
    axes.set_ylabel("Negative RMSE")

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
