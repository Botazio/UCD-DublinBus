from pathlib import Path
from multiprocessing import Pool
from datetime import datetime, timedelta, timezone
import logging
from statistics import mean
from os import path
import environ
import requests
from django.conf import settings
from dublinbus.models import Calendar, Stop
from quantile_dotplot import ntile_dotplot, compute_ntiles
import keras
import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

def request_realtime_nta_data():
    """
    Make a request to the NTA realtime API
    """

    headers = {
        # Request headers
        'Cache-Control': 'no-cache',
        'x-api-key': settings.NTA_DEVELOPER_KEY
    }
    realtime_response = requests.get(
        'https://gtfsr.transportforireland.ie/v1/?format=json',
        headers=headers
    )

    return realtime_response.json()['entity']

def get_realtime_dublin_bus_delay(realtime_updates, trip_id, stop_sequence):
    """
    Get the current delay for a particular trip from the response from the
    realtime NTA API.
    Args
    ---
        realtime_updates: list
            A list of dicts with updates for each trip from the realtime API
        trip_id: str
            The ID for the trip we want to get the delay for
        stop_sequence: int
            The stop sequence number for this stop in this trip

    Returns
    ---
        The current delay for the trip in seconds. 0 means there is no delay and a negative
        number means the bus is ahead of schedule.
    """

    # Get stop time updates for this trip or else return None
    trip_updates = next(filter(lambda trip: trip['id'] == trip_id, realtime_updates), None)

    if trip_updates:

        stop_time_updates = trip_updates['trip_update'].get('stop_time_update')

        if stop_time_updates:

            # Sort updates in reverse order by stop_sequence
            stop_time_updates = sorted(
                stop_time_updates,
                key=lambda update: update['stop_sequence'],
                reverse=True
            )

            # Only get delay if stop_sequence of latest update is lower than the
            # stop_sequence of the requested stop
            if stop_time_updates[0]['stop_sequence'] < stop_sequence:
                return stop_time_updates[0]['departure']['delay']

    return 0


def get_due_in_time(current_time, scheduled_arrival_time, delay):
    """
    Calculate the expected due time from now for a particular trip.

    Args
    ---
        current_time: datetime object
            The time of when query was made in UTC.
        scheduled_arrival_time: datetime.time
            The time the bus is scheduled to arrive at the stopid in UTC.
        delay: int
            The current delay for the trip in seconds.
    Returns
    ---
        The expected due time for trip in minutes as an int.
    """

    # extract date from curr_time and concatenate to scheduled_arrival_time (time past midnight)
    # e.g. "23/06/21 " + "12:04:25" = "23/06/21 12:04:25"
    scheduled_arrival_datetime_str = current_time.strftime(
        "%d/%m/%y ") + str(scheduled_arrival_time)

    # create datetime object for scheduled_arrival_datetime.
    scheduled_arrival_datetime_obj = datetime.strptime(scheduled_arrival_datetime_str,
                                                       '%d/%m/%y %H:%M:%S').replace(
        tzinfo=timezone(timedelta(hours=1)))

    # subtract current_time from scheduled_arrival_datetime_obj
    # To be able to subtract, both scheduled_arrival_datetime_obj
    # and current_time must be datetime objects and in the same
    # timezone scheduled_arrival_time given to second precision
    # so removing microsecond precision from current_time
    time_delta = scheduled_arrival_datetime_obj - \
        current_time.replace(microsecond=0)

    # add delay to due time
    time_delta_seconds = time_delta.total_seconds() + delay
    return round(time_delta_seconds / 60)

def date_to_service_ids(requested_date):
    """
    A function which returns which valid service IDs
    for a particular date. This is taken from the
    calendar.txt file from the static GTFS Dublin Bus data.

    Args
    ---
        requested_date: datetime
            A datetime object for the requested day

    """

    # Get the day of the week
    day = requested_date.strftime("%A").lower()

    service_ids = list(Calendar.objects
                .filter(**{day: True})
                .filter(
                    start_date__lte=requested_date,
                    end_date__gte=requested_date
                )
                .values_list('service_id', flat=True)
    )

    if len(service_ids) > 1:
        logging.info("More than one valid service ID.")

    return service_ids

def multiprocessing_adjacent_stop_prediction(trip_stop_times, features, num_predictions,
                                                num_processes=8):
    """
    Use Python's multiprocessing to make adjacent stop pair predictions

    """

    # initialize the Pool
    with Pool(processes=num_processes) as pool:

        # add features before staring multiprocessing
        trip_stop_times_with_features = []
        for trip_stop in trip_stop_times:
            trip_stop_times_with_features.append(
                trip_stop + (features, num_predictions,)
            )

        # map is blocking so we don't need to close or join
        multiprocessing_results = pool.map(
            handle_adjacent_stop_prediction,
            trip_stop_times_with_features,
        )

    return multiprocessing_results

def handle_adjacent_stop_prediction(stop_tuple):
    """
    Function that is used by map in multiprocessing
    that only takes one argument at a time

    """

    stop_a, stop_b, features, num_predictions = stop_tuple

    stop_pair_time_predictions = predict_adjacent_stop(
                stop_a['stoptime__stop__stop_num'],
                stop_b['stoptime__stop__stop_num'],
                features,
                num_predictions=num_predictions
            )

    # Store the results for this stop pair
    stop_pair_details = {
        'departure_stop': stop_a['stoptime__stop__stop_num'],
        'arrival_stop': stop_b['stoptime__stop__stop_num'],
        'predictions': stop_pair_time_predictions
    }

    return stop_pair_details

def predict_adjacent_stop(departure_stop_num, arrival_stop_num, features, num_predictions):
    """
    Predict the time to travel between two adjacent stops on the same route trip.
    This method uses stop numbers and not stop IDs since stop IDs are not available
    in the historical data used to train the model.

    Args
    ---
        departure_stop_num: int
            The number of the departure stop (e.g., 767)

        departure_stop_num: int
            The number of the departure stop (e.g., 768)

        features: dict
            Dict of features

        num_predictions: int, default 10
            The number of predictions to return

    Returns
    ---
        An array of predictions for the travel time between the two adjacent stops. Returns
        an array of the expected travel times if a prediction cannot be found.
    """
    tf.compat.v1.disable_eager_execution()

    model_path = f"./model_output/NeuralNetwork/{departure_stop_num}_to_{arrival_stop_num}/"

    if path.exists(model_path):
        logging.info(f"Found a model for {departure_stop_num}_to_{arrival_stop_num}")
        trained_nn_model = keras.models.load_model(model_path, compile=True)

        input_row = np.reshape(np.array(list(features.values())), (1, 8))

        predictions = make_probabilistic_predictions(
            input_row,
            trained_nn_model,
            num_predictions=num_predictions
        )

        return predictions

    # no model exists for this stop pair so just use expected times
    logging.warning(f"No model found for {departure_stop_num}_to_{arrival_stop_num}. " +
                "Trying timetable instead.")
    timetable_2021 = pd.read_csv("./model_output/timetable/stop_pairs_2021.csv")
    prediction = timetable_2021.loc[
                    timetable_2021['stop_pair'] == f"{departure_stop_num}_to_{arrival_stop_num}",
                    "expected_travel_time"
                ].values

    if len(prediction) == 0:
        logging.warning(f"No data found for found for {departure_stop_num}_to_{arrival_stop_num} " +
            "in the timetable. Returning no prediction for this stop pair")
        return np.repeat(0, num_predictions)

    return np.repeat(np.mean(prediction), num_predictions)

def make_probabilistic_predictions(inputs, trained_nn_model, num_predictions):
    """
    Take a row of input data and a trained keras model for a particular stop pair
    and make many predictions. This can be used to generate a probability distribution
    of predictions.

    Args
    ---
        inputs: numpy array
            A row of input data in the form of a numpy array

        trained_nn_model: keras model
            A trained neural network model from keras

        num_predictions: int, default 10
            The number of predictions to make

    Returns
    ---
    A numpy array of predictions for the input row
    """

    predictions = np.array([])
    for _ in range(num_predictions):
        pred = trained_nn_model.predict(inputs)
        predictions = np.append(predictions, pred[0])

    return predictions

def plot_probabilistic_predictions(stop_pair, predictions):
    """
    Take an array of predictions for a journey between two stops
    and draw a probability density curve

    Args
    ---
        stop_pair: str
            The stop pair that the predictions were generated for

        predictions: array-like
            An array of predictions for a particular input

    Returns
    ---
    A probability density curve and a quantile dotplot
    """

    _, axes = plt.subplots(1, 1, figsize=(10, 10))

    # Kernel density estimate (KDE)
    # Used as alternative to histogram to visualise distribution
    sns.kdeplot(predictions, shade=True, ax=axes)

    ntile_dotplot(
        np.round(predictions / 60, 2),
        dots=20,
        edgecolor="k",
        linewidth=2,
        ax=axes,
        color="blue"
    )

    centers, _  = compute_ntiles(
        np.round(predictions / 60, 2),
        dots=20,
        hist_bins='auto'
    )

    departure_stop_num = Stop.objects.get(stop_id=stop_pair.split("_")[0]).stop_num
    arrival_stop_num = Stop.objects.get(stop_id=stop_pair.split("_")[-1]).stop_num

    axes.set_xlabel("Journey Time (minutes)", fontsize=18)
    axes.set_title(
        f"Quantile Dotplot: Stop {departure_stop_num} to Stop {arrival_stop_num}",
        fontsize=24
    )

    for spine in ("left", "right", "top"):
        axes.spines[spine].set_visible(False)
    axes.yaxis.set_visible(False)
    axes.set_xticklabels(['{0:.2f}'.format(center) for center in centers])
    axes.tick_params(axis='x', which='both', labelsize=16)

    # Plot mean as a red line
    axes.axvline(
        mean(predictions / 60),
        ymax=0.8,
        color='red'
    )

    home = str(Path.home())
    plt.savefig(home + f"/data/images/dotplot_{stop_pair}.png")
    plt.close()

def check_bank_holiday(input_date):
    """
    Returns 1 if the inputted date is a bank holiday in Ireland
    or 0 otherwise

    Args
    ---
        input_date: datetime
            A DateTime object

    Returns
    ---
    An int which is 1 if it's a bank holiday or 0 otherwise
    """

    bank_holidays_2021 = [
        # New Year's Day
        datetime(2021, 1, 1),
        # St Patricks' Day
        datetime(2021, 3, 17),
        # Easter Monday
        datetime(2021, 4, 5),
        # May Bank Holiday
        datetime(2021, 5, 3),
        # June Bank Holiday
        datetime(2021, 6, 7),
        # August Bank Holiday
        datetime(2021, 8, 2),
        # October Bank Holiday
        datetime(2021, 10, 25),
        # Christmas Day
        datetime(2021, 12, 25),
        # St Stephen's Day
        datetime(2021, 12, 26),
    ]

    return input_date in bank_holidays_2021

def get_weather_forecast(requested_datetime):
    """
    Get the weather forecast for a particular datetime for Dublin.
    This currently only works for the next 48 hours because of API
    limits.

    Args
    ---
        requested_datetime: DateTime object
            A DateTime in the next 48 hours

    Returns
    ---
    A dict of weather forecasts for rain, temp and lagged_rain
    """

    weather_forecast = {}

    # Get forecasted weather
    weather_response = requests.get(
        "https://api.openweathermap.org/data/2.5/onecall?lat=53.350140&lon=-6.266155" +
            f"&exclude=current,minutely,alerts&units=metric&appid={env('OPENWEATHER_API_KEY')}"
    ).json()

    # Try 48 hour forecast hourly data first
    for hour in weather_response['hourly']:
        open_weather_dt = datetime.fromtimestamp(hour['dt'])

        if (open_weather_dt.date() == requested_datetime.date()
                and open_weather_dt.hour == (requested_datetime.hour - 1)):

            # rain is not included as a value if there is no rain
            if "rain" not in hour:
                weather_forecast['lagged_rain'] = 0
            else:
                weather_forecast['lagged_rain'] = hour['rain']['1h']

        # Matches to the nearest hour
        if (open_weather_dt.date() == requested_datetime.date()
                and open_weather_dt.hour == requested_datetime.hour):

            weather_forecast['temp'] = hour['temp']

            # rain is not included as a value if there is no rain
            if "rain" not in hour:
                weather_forecast['rain'] = 0
            else:
                weather_forecast['rain'] = hour['rain']['1h']

            return weather_forecast

    # Fall back to 7 day daily forecasts because no matches for 48 hourly forecast
    for day in weather_response['daily']:

        open_weather_dt = datetime.fromtimestamp(day['dt'])

        if open_weather_dt.date() == requested_datetime.date():

            weather_forecast['temp'] = day['temp']

            # rain is not included as a value if there is no rain
            if "rain" not in day:
                weather_forecast['rain'] = 0
                weather_forecast['lagged_rain'] = 0
            else:
                weather_forecast['rain'] = day['rain']
                # Can't get proper lagged value for rain since
                # it's not hourly
                weather_forecast['lagged_rain'] = day['rain']

    return weather_forecast

def filter_trip_stop_times(trip_stop_times, departure_stop_id, arrival_stop_id):
    """
    Takes all the stop times for a particular trip and filters them down to those
    between the specified departure stop and arrival stop (inclusive).

    Args
    ---
        trip_stop_times: list of dicts
            A list of stop times for a trip where each stop time is a dict

        departure_stop_id: str

        arrival_stop_id: str
    """

    sorted_stop_times = sorted(trip_stop_times, key=lambda k: k['stoptime__stop_sequence'])
    for i, trip in enumerate(sorted_stop_times):
        if trip['stoptime__stop_id'] == departure_stop_id:
            start = i

        if trip['stoptime__stop_id'] == arrival_stop_id:
            end = i

    return zip(sorted_stop_times[start:end], sorted_stop_times[start+1:end+1])
