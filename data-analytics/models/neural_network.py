import datetime
import sys

from tensorflow.keras.layers.experimental.preprocessing import Normalization
from sklearn.model_selection import TimeSeriesSplit, train_test_split
from keras.models import Model
from keras.layers import Input, Dense, Dropout
import keras
from .utils import train_all_stop_pair_models

current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
model_name = "NeuralNetwork"

normalizer = Normalization(axis=-1)
dropout_rate = 0.2

inputs = keras.Input(shape=(8,))
# TODO: Does this actually apply the normalizer?
x = normalizer(inputs)

if sys.argv[1] == "small":
    x = Dense(16, activation='relu')(inputs)
    x = Dropout(dropout_rate)(x, training=True)
    x = Dense(16, activation='relu')(x)
    x = Dropout(dropout_rate)(x, training=True)
elif sys.argv[1] == "medium":
    x = Dense(64, activation='relu')(inputs)
    x = Dropout(dropout_rate)(x, training=True)
    x = Dense(64, activation='relu')(x)
    x = Dropout(dropout_rate)(x, training=True)
    x = Dense(64, activation='relu')(x)
    x = Dropout(dropout_rate)(x, training=True)
elif sys.argv[1] == "large":
    x = Dense(512, activation='relu')(inputs)
    x = Dropout(dropout_rate)(x, training=True)
    x = Dense(512, activation='relu')(x)
    x = Dropout(dropout_rate)(x, training=True)
    x = Dense(512, activation='relu')(x)
    x = Dropout(dropout_rate)(x, training=True)
    x = Dense(512, activation='relu')(x)
    x = Dropout(dropout_rate)(x, training=True)

outputs = Dense(1)(x)

model = keras.Model(inputs, outputs)

model.compile(loss='mse', optimizer='adam')
train_all_stop_pair_models(model, "NeuralNetwork")