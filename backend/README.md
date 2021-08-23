## Config File
To run the application, create a file called `backend/backend/.env` with the following values (without quotation marks):
```
NTA_DEVELOPER_KEY=YOUR_KEY
AWS_MYSQL_PASSWORD=AWS_MYSQL_PASSWORD
LOCAL_MYSQL_PASSWORD=LOCAL_MYSQL_PASSWORD
SOCIAL_SECRET=SOCIAL_SECRET
GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
```

## Databases
By default the Django backend will use the MySQL instance hosted by AWS. 

To switch to a local MySQL instance instead you can set the following environment variable:
```bash
export DB='local_mysql'
```
This requires that the MySQL database is setup correctly on the local host.

To switch to a local SQLite instance you can set the following environment variable:
```bash
export DB='local_sqlite3'
```

### Database Creation
Before running the setup_db.sh script, the GTFS_STATIC_DIR environmental variable must be set, which specifies the path to where the GTFS static files are located e.g.
```bash
export GTFS_STATIC_DIR='/home/team13/UCD-DublinBus/backend/dublinbus/scripts/gtfs_static'
```

## Data Analytics

### Method 1: Adjacent Stops Model
One way to frame the prediction problem is to match all pairs of adjacent bus stops where it is possible to get a bus between them.
A separate model is then trained for each of these pairs. The training data can come from any bus route that travels between the two stops at any time. There are two stages to this adjacent stops approach:

#### Stage 1: Pre-processing
1. Matching Adjacent Pairs of Stops: This step matches up pairs of adjacent stops
for each day in the 2018 data and saves them as separate parquet files. Run it from the ``data-analytics``
folder as follows:

```bash
nohup python -u -m preprocessing.run_preprocessing create_adjacent_stop_pairs &
```

It saves the output to ``/home/team13/data/adjacent_stop_pairs/``. Timestampted logs are available in
``/home/team13/logs/preprocessing/``.

2. Feature Engineering: This stage takes the input of the previous stage and combines all the
parquet files for a particular stop pair together and adds features. Run it from the ``data-analytics`` folder
as follows:

```bash
nohup python -u -m preprocessing.run_preprocessing features &
```

It saves the output to ``/home/team13/data/adjacent_stop_pairs_with_features/``. Timestampted logs are available in
``/home/team13/logs/preprocessing/``. The features are:
* ``bank_holiday``: A binary variable that is 1 if the date was a bank holiday or 0 otherwise
* ``cos_time``: The cosine of the number of seconds since midnight
* ``sin_time``: The sine of the number of seconds since midnight
* ``cos_day``: The cosine of the numeric day of the week (0 for Monday, 1 for Tuesday, etc.)
* ``sin_day``: The sine of the numeric day of the week (0 for Monday, 1 for Tuesday, etc.)
* ``is_weekend``: A binary variable equal to 1 if it's a weekend or 0 otherwise
* ``day_1-day_6``: One-hot encoding of the days of the week.
* ``rain``: Amount of precipitation in mm in the current hour
* ``lagged_rain``: Amount of precipitation in mm in the previous hour
* ``temp``: Air temperature in degrees celsius

Only one of the ``cos_day`` and ``sin_day``, the ``is_weekend``, or the ``day_1-day_6`` features should be used at a time.

#### Stage 2: Model Fitting
To run a model run a command such as:
```bash
nohup python -u -m models.run_model linear-regression train &
nohup python -u -m models.run_model random-forest train &
```

from the ``data-analytics`` folder. 

The saved models and the associated metrics will be saved to ``/home/team13/model_output/``. It is also possible to create learning curves for a particular stoppair by using the command:
```bash
python -u -m models.linear_regression learning-curve 618_to_619
```

The learning curves will be saved to ``/home/team13/model_output/``.

#### Dwell Time
An important consideration in predicting the time taken for a bus journey is whether our predictions will include the time that the bus may spend waiting at a particular bus stop which is known as "dwell time". One approach could involve simply ignoring this and assuming that it will be an insignificant factor in the overall prediction. This would involve using the time that a bus leaves a stop and _arrives_ at the next stop as the target value. Alternatively, we could try to account for dwell time by using the time that a bus leaes a stop and _departs_ from the next stop as the target value. This target should then include any time spent by the bus at the stop. One disadvantage of this method is that the prediction might slightly overestimate the time for journeys between adjacent stops. However, for longer journeys involving many stops it seems better to try to include this dwell time because omitting it could result in a significant underestimation of true journey times.

### Method 2: Full Route Prediction
An alternative way to frame the problem is to make a time prediction for the full route in a particular direction and then split this
prediction up based on the historical averages as requested by the user.