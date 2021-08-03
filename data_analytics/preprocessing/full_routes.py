import sys
from keras.backend import maximum
from numpy.core.numeric import full
import pandas as pd
import numpy as np
from os import path
import keras
import sqlite3
import math
from .utils import bank_holidays_2018
import keras
from keras.layers import Dense, Dropout
from keras.wrappers.scikit_learn import KerasRegressor
from tensorflow.keras.layers.experimental.preprocessing import Normalization
from sklearn.model_selection import TimeSeriesSplit, train_test_split

conn = sqlite3.connect("./db/DublinBusHistoric.db")

def get_stops(trip_id):
    """
    Get the stops for a particular trip

    Args
    ---
        trip_id: str
    """

    stops = pd.read_sql(f"""
        SELECT STOPPOINTID, PROGRNUMBER, DAYOFSERVICE, ACTUALTIME_DEP
        FROM leavetimes
        WHERE TRIPID={trip_id}
    """, conn).sort_values(['DAYOFSERVICE', 'PROGRNUMBER'])

    # TODO: Assuming stop sequence always the same?
    stops = stops.drop_duplicates(['STOPPOINTID', 'PROGRNUMBER']).sort_values(['PROGRNUMBER'])['STOPPOINTID'].to_numpy()

    return stops

def get_proportional_stop_journeys(trip_id, dayofservice):

    stoptimes = pd.read_sql(f"""
        SELECT STOPPOINTID, PROGRNUMBER, ACTUALTIME_DEP
        FROM leavetimes
        WHERE TRIPID={trip_id} AND DAYOFSERVICE='{dayofservice}'
    """, conn).sort_values(['PROGRNUMBER'])

    stoptimes.loc[:, 'total_travel_time'] = stoptimes.iloc[stoptimes.shape[0] - 1, 2] - stoptimes.iloc[0, 2]
    stoptimes.loc[:, 'travel_time_diff'] = stoptimes['ACTUALTIME_DEP'] - stoptimes.iloc[0, 2]
    stoptimes.loc[:, 'travel_time_pct'] = stoptimes['travel_time_diff'] / stoptimes['total_travel_time']

    return stoptimes[['STOPPOINTID', 'PROGRNUMBER', 'travel_time_pct']]

def add_features(trip_df):
    """
    Add features to the trip

    Args
    ---
        trip: DataFrame row

    """

    trip_df.loc[:, 'DAYOFSERVICE'] = pd.to_datetime(trip_df['DAYOFSERVICE'], format="%d-%b-%y %H:%M:%S")
    trip_df.loc[:, 'hour'] = (trip_df['ACTUALTIME_DEP'] / (60 * 60)).astype(int)

    # Dublin Bus data uses hours >= 24 for the next day (e.g., 25:00 for 1am)
    # Move the day of service to the next day and convert hour back to 24hr clock
    trip_df.loc[trip_df['hour'] >= 24,
                        'DAYOFSERVICE'] = trip_df.loc[trip_df['hour'] >= 24, 'DAYOFSERVICE'] + pd.Timedelta(days=1)
    trip_df.loc[:, 'hour'] = trip_df.loc[:, 'hour'] % 24

    trip_df.loc[:, 'date'] = trip_df.loc[:, 'DAYOFSERVICE'].dt.date
    trip_df.loc[:, 'day'] = trip_df.loc[:, 'DAYOFSERVICE'].dt.weekday

    # cosine and sine of seconds since midnight
    SECONDS_IN_DAY = 24 * 60 * 60
    trip_df.loc[:, 'cos_time'] = np.cos(
        trip_df['ACTUALTIME_DEP'] * (2 * np.pi / SECONDS_IN_DAY))
    trip_df.loc[:, 'sin_time'] = np.sin(
        trip_df['ACTUALTIME_DEP'] * (2 * np.pi / SECONDS_IN_DAY))

    # cosine and sine of day of week number
    trip_df.loc[:, 'cos_day'] = np.cos(trip_df['day'] * (2 * np.pi / 7))
    trip_df.loc[:, 'sin_day'] = np.sin(trip_df['day'] * (2 * np.pi / 7))

    # dummy variable for weekend
    trip_df.loc[:, 'is_weekend'] = 0
    trip_df.loc[trip_df['day'].isin([5, 6]), "is_weekend"] = 1

    # one-hot encoding of days
    day_of_week_columns = pd.get_dummies(trip_df['day'], drop_first=True, prefix="day")
    trip_df[list(day_of_week_columns)] = day_of_week_columns

    trip_df = trip_df.drop('DAYOFSERVICE', axis=1)

    # Add weather
    weather_df = pd.read_csv(
        "./data/met_eireann_hourly_phoenixpark_dec2017jan2019.csv",
        usecols=['date', 'rain', 'temp'])
    weather_df.loc[:, 'datetime'] = pd.to_datetime(
        weather_df['date'].str.upper(), format="%d-%b-%Y %H:%M")
    weather_df = weather_df.drop('date', axis=1)
    weather_df.loc[:, 'date'] = weather_df['datetime'].dt.date
    weather_df.loc[:, 'hour'] = weather_df['datetime'].dt.hour
    weather_df = weather_df.sort_values('datetime')
    weather_df.loc[:, 'lagged_rain'] = weather_df['rain'].shift(1)

    trip_df = pd.merge(trip_df, weather_df, on=[
                            'date', 'hour'], how='left')

    # bank holiday trip_df
    trip_df.loc[:, 'bank_holiday'] = 0
    trip_df.loc[trip_df['date'].isin(bank_holidays_2018), 'bank_holiday'] = 1

    return trip_df

def full_route_evaluation(route, direction, num_trips=100):

    route_df = pd.read_csv(f'./data/full_routes/{route}_{direction}_full.csv').dropna(subset=['ACTUALTIME_ARR', 'ACTUALTIME_DEP'])

    squared_diffs_predicted = []
    abs_diffs_predicted = []

    squared_diffs_timetable = []
    abs_diffs_timetable = []
    
    # Calculate the squared difference between each trip on each day and the prediction for this route
    dayofservice_trip_pairs = route_df[['DAYOFSERVICE', 'TRIPID']].drop_duplicates().sort_values('DAYOFSERVICE').to_numpy()
    print(f"{len(dayofservice_trip_pairs)} day of service and trip pairs found")

    for dayofservice, trip_id in dayofservice_trip_pairs[:num_trips]:

        trip = route_df[(route_df['TRIPID'] == trip_id) & (route_df['DAYOFSERVICE'] == dayofservice)]
        features = ['cos_time', 'sin_time', 'cos_day', 'sin_day', 'rain',
                'lagged_rain', 'temp', 'bank_holiday']
        trip_with_features = add_features(trip)[features]

        adjacent_stop_pair_predictions = []

        # assuming stops stay the same
        stops = get_stops(trip_id)

        # Do the adjacent stop pair predictions
        for departure_stop, arrival_stop in zip(stops[:-1], stops[1:]):

            model_path = f"./model_output/NeuralNetwork/{departure_stop}_to_{arrival_stop}_NeuralNetwork/"

            if path.exists(model_path):
                print(f"Found model for {departure_stop}_to_{arrival_stop}")
                trained_nn_model = keras.models.load_model(model_path)

                # This should be the same every time?
                # print(trip_with_features)
                input_row = np.reshape(trip_with_features.to_numpy(), (1, 8))

                adjacent_stop_pair_predictions.append(trained_nn_model.predict(input_row))

            else:
                # no model exists for this stop pair so just use expected times
                print(f"No model found for {departure_stop}_to_{arrival_stop}." +
                            "Using timetable instead.")
                timetable_2021 = pd.read_csv("./model_output/timetable/stop_pairs_2021.csv")
                predicted_journey_time = np.mean(timetable_2021.loc[
                                timetable_2021['stop_pair'] == f"{departure_stop}_to_{arrival_stop}",
                                "expected_travel_time"
                            ].values)

        actual_journey_time = (trip['ACTUALTIME_ARR'] - trip['ACTUALTIME_DEP']).iloc[0]

        predicted_journey_time = sum(adjacent_stop_pair_predictions)
        squared_diffs_predicted.append((predicted_journey_time - actual_journey_time)**2)
        abs_diffs_predicted.append((abs(actual_journey_time - predicted_journey_time) / actual_journey_time) * 100)

        timetable_journey_time = (trip['PLANNEDTIME_ARR'] - trip['PLANNEDTIME_DEP']).iloc[0]
        squared_diffs_timetable.append((timetable_journey_time - actual_journey_time)**2)
        abs_diffs_timetable.append((abs(actual_journey_time - timetable_journey_time) / actual_journey_time) * 100)

    print(sum(abs_diffs_predicted) / len(abs_diffs_predicted))
    print(sum(abs_diffs_timetable) / len(abs_diffs_timetable))
    # Get the RMSE for certain trips for a route in one direction
    return {
        'RMSE_predicted': math.sqrt(sum(squared_diffs_predicted) / len(squared_diffs_predicted)), 
        'MAPE_predicted': (sum(abs_diffs_predicted) / len(abs_diffs_predicted)),
        'RMSE_timetable': math.sqrt(sum(squared_diffs_timetable) / len(squared_diffs_timetable)), 
        'MAPE_timetable': (sum(abs_diffs_timetable) / len(abs_diffs_timetable))
    }

def full_route_model(route, direction, num_trips):

    route_df = pd.read_csv(f'./data/full_routes/{route}_{direction}_full.csv')

    dayofservice_trip_pairs = route_df[['DAYOFSERVICE', 'TRIPID']].drop_duplicates().sort_values('DAYOFSERVICE').to_numpy()
    print(f"{len(dayofservice_trip_pairs)} day of service and trip pairs found")

    pcts = []
    for dayofservice, trip_id in dayofservice_trip_pairs[:num_trips]:
        proportional_stop_journeys = get_proportional_stop_journeys(trip_id, dayofservice)
        pcts.append(proportional_stop_journeys['travel_time_pct'].to_numpy())

    max_width = 1 
    for row in pcts: 
        if len(row) > max_width: 
            max_width = len(row) 

    final_pcts = [] 
    for row in pcts:
        if len(row) == max_width:
            final_pcts.append(row)

    proportional_stop_journeys['avg_journey_times_pct'] = sum(final_pcts) / len(final_pcts)
    proportional_stop_journeys[
        ['STOPPOINTID', 'PROGRNUMBER', 'avg_journey_times_pct']
    ].to_csv(f"./data/proportional_stop_journeys/{route}_{direction}.csv", index=False)

    route_df = add_features(route_df.dropna(how='any')).sort_values('date')
    print(route_df)

    # train models
    y_full = route_df['total_travel_time']
    features = ['cos_time', 'sin_time', 'cos_day', 'sin_day', 'rain',
                'lagged_rain', 'temp', 'bank_holiday']
    x_full = route_df[features]

    x_train, x_test, y_train, y_test = train_test_split(
        x_full,
        y_full,
        test_size=0.20,
        # Don't shuffle because time-series data that's already been sorted
        shuffle=False
    )

    normalizer = Normalization(axis=-1)
    normalizer.adapt(x_train)

    model = create_keras_model(0.2, 10, 15, normalizer)

    results = model.fit(x_train.to_numpy(), y_train.to_numpy(), epochs=15)
    math.sqrt(results.history['loss'][-1])
    model.evaluate(x_test.to_numpy(), y_test.to_numpy())

    model.fit(x_full.to_numpy(), y_full.to_numpy(), epochs=15)

    return model


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

trips_df = pd.read_sql("""
    SELECT * FROM trips
""", conn)

# Get details on all the lines in each direction and the total travel time
for line, direction in trips_df[['LINEID', 'DIRECTION']].drop_duplicates().to_numpy():
    print(f"{line} - {direction}")
    route_trips = trips_df[(trips_df['LINEID'] == line) & (trips_df['DIRECTION'] == direction)]
    route_trips.loc[:, 'total_travel_time'] = route_trips.loc[:, 'ACTUALTIME_ARR'] - route_trips.loc[:, 'ACTUALTIME_DEP']
    route_trips.to_csv(f'./data/full_routes/{line}_{direction}_full.csv', index=False)

# ************************** #
# Full Route Evaluation
# How well do our adjacent stop pair models perform for a full route?
# ************************** #

if sys.argv[1] == "evaluate":

    for route in ['46A', '4', '11', '7', '84A', '31B']:
        # Get the RMSE across a certain number of trips on all days for a particular line
        metrics = full_route_evaluation(route=route, direction=1, num_trips=10)
        print(f"{route}_{1} RMSE predicted - {metrics['RMSE_predicted']} seconds, {metrics['RMSE_predicted'] / 60} minutes")
        print(f"{route}_{1} MAPE predicted - {metrics['MAPE_predicted']}%")

        print(f"{route}_{1} RMSE timetable - {metrics['RMSE_timetable']} seconds, {metrics['RMSE_timetable'] / 60} minutes")
        print(f"{route}_{1} MAPE timetable - {metrics['MAPE_timetable']}%")

        metrics = full_route_evaluation(route=route, direction=2, num_trips=10)
        print(f"{route}_{2} RMSE predicted - {metrics['RMSE_predicted']} seconds, {metrics['RMSE_predicted'] / 60} minutes")
        print(f"{route}_{2} MAPE predicted - {metrics['MAPE_predicted']}%")

        print(f"{route}_{2} RMSE timetable - {metrics['RMSE_timetable']} seconds, {metrics['RMSE_timetable'] / 60} minutes")
        print(f"{route}_{2} MAPE timetable - {metrics['MAPE_timetable']}%")

# ************************** #
# Full Route Models
# ************************** #
elif sys.argv[1] == "models":

    for route in ['39A']:

        direction = 1

        full_route_model = full_route_model(route=route, direction=direction, num_trips=500)

        route_df = pd.read_csv(f'./data/full_routes/{route}_{direction}_full.csv')

        # choose a random trip
        trip_id = route_df['TRIPID'].iloc[0]
        dayofservice = route_df['DAYOFSERVICE'].iloc[0]

        # assuming stops stay the same
        # prediction for full route at the moment
        stops = get_stops(trip_id)

        trip = route_df[(route_df['TRIPID'] == trip_id) & (route_df['DAYOFSERVICE'] == dayofservice)]

        features = ['cos_time', 'sin_time', 'cos_day', 'sin_day', 'rain',
                    'lagged_rain', 'temp', 'bank_holiday']
        trip_with_features = add_features(trip)[features]
        print(trip_with_features)

        adjacent_stop_pair_predictions = []
        # Do the adjacent stop pair predictions
        for departure_stop, arrival_stop in zip(stops[:-1], stops[1:]):

            model_path = f"./model_output/NeuralNetwork/{departure_stop}_to_{arrival_stop}_NeuralNetwork/"

            if path.exists(model_path):
                print(f"Found model for {departure_stop}_to_{arrival_stop}")
                trained_nn_model = keras.models.load_model(model_path)

                # This should be the same every time?
                # print(trip_with_features)
                input_row = np.reshape(trip_with_features.to_numpy(), (1, 8))

                adjacent_stop_pair_predictions.append(trained_nn_model.predict(input_row))

            else:
                # no model exists for this stop pair so just use expected times
                print(f"No model found for {departure_stop}_to_{arrival_stop}." +
                            "Using timetable instead.")
                timetable_2021 = pd.read_csv("./model_output/timetable/stop_pairs_2021.csv")
                predicted_journey_time = np.mean(timetable_2021.loc[
                                timetable_2021['stop_pair'] == f"{departure_stop}_to_{arrival_stop}",
                                "expected_travel_time"
                            ].values)

        predicted_journey_time = sum(adjacent_stop_pair_predictions)
        actual_journey_time = (trip['ACTUALTIME_ARR'] - trip['ACTUALTIME_DEP']).iloc[0]
        print(predicted_journey_time)
        print(actual_journey_time)
        print(full_route_model.predict(np.reshape(trip_with_features.to_numpy(), (1, 8))))
