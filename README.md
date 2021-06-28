# COMP47360 - Research Practicum
Code for the group project for COMP47360 - Research Practicum

## Config File
To run the application, create a file called `backend/backend/.env` with the following values (without quotation marks):
```
NTA_DEVELOPER_KEY=YOUR_KEY
AWS_MYSQL_PASSWORD=AWS_MYSQL_PASSWORD
LOCAL_MYSQL_PASSWORD=LOCAL_MYSQL_PASSWORD
```

## Databases
By default the Django backend will use the MySQL instance hosted by AWS. To switch to a local MySQL instance instead you can set the following environment variable:
```bash
export DB='local'
```
This requires that the MySQL database is setup correctly on the local host.

## Data Analytics
The data analytics part of the project is divided into two stages:

### Stage 1: Pre-processing
1. Matching Adjacent Pairs of Stops: This step matches up pairs of adjacent stops
for each day in the 2018 data and saves them as separate CSV files. It saves the output to 

```bash
nohup python -u data-analytics/preprocessing/run_preprocessing.py create_adjacent_stop_pairs &
```

It saves the output to ``/home/team13/data/adjacent_stop_pairs/``. Timestampted logs are available in 
``/home/team13/logs/preprocessing/``.

2. Feature Engineering: This stage takes the input of the previous stage and combines all the
CSVs files for a particular stop pair together and adds features.

```bash
nohup python -u data-analytics/preprocessing/run_preprocessing.py features &
```

It saves the output to ``/home/team13/data/adjacent_stop_pairs_with_features/``. Timestampted logs are available in 
``/home/team13/logs/preprocessing/``.

### Stage 2: Model Fitting
To run a model use:
```bash
nohup python -u data-analytics/models/linear_regression.py &
```
