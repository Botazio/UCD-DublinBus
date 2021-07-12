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

### Database Creation
Before running the setup_db.py script, the DJANGO_BACKEND environmental variable must be set, which specifies the path to the django project root directory e.g.
```bash
export DJANGO_BACKEND='/home/team13/UCD-DublinBus/backend'
```

## Data Analytics
The data analytics part of the project is divided into two stages:

### Stage 1: Pre-processing
1. Matching Adjacent Pairs of Stops: This step matches up pairs of adjacent stops
for each day in the 2018 data and saves them as separate CSV files. Run it from the ``data-analytics``
folder as follows:

```bash
nohup python -u -m preprocessing.run_preprocessing create_adjacent_stop_pairs &
```

It saves the output to ``/home/team13/data/adjacent_stop_pairs/``. Timestampted logs are available in
``/home/team13/logs/preprocessing/``.

2. Feature Engineering: This stage takes the input of the previous stage and combines all the
CSVs files for a particular stop pair together and adds features. Run it from the ``data-analytics`` folder
as follows:

```bash
nohup python -u -m preprocessing.run_preprocessing features &
```

It saves the output to ``/home/team13/data/adjacent_stop_pairs_with_features/``. Timestampted logs are available in
``/home/team13/logs/preprocessing/``.

### Stage 2: Model Fitting
To run a model run a command such as:
```bash
nohup python -u -m models.linear_regression &
```

from the ``data-analytics`` folder.
