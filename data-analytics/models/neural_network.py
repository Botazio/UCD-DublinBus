import datetime
import sys

from tensorflow.keras.layers.experimental.preprocessing import Normalization
from keras.layers import Dense, Dropout
import keras
from .utils import train_all_stop_pair_models

current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")

normalizer = Normalization(axis=-1)
DROPOUT_RATE = 0.2

inputs = keras.Input(shape=(8,))

if sys.argv[1] == "small":
    x = normalizer(inputs)
    x = Dense(8, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)
    x = Dense(8, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)
elif sys.argv[1] == "medium":
    x = normalizer(inputs)
    x = Dense(64, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)
    x = Dense(64, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)
    x = Dense(64, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)
elif sys.argv[1] == "large":
    x = normalizer(inputs)
    x = Dense(512, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)
    x = Dense(512, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)
    x = Dense(512, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)
    x = Dense(512, activation='relu')(x)
    x = Dropout(DROPOUT_RATE)(x, training=True)

outputs = Dense(8)(x)
model = keras.Model(inputs, outputs)

model.compile(loss='mse', optimizer='adam')
train_all_stop_pair_models(model, "NeuralNetwork", normalizer=normalizer)
