import requests
from datetime import datetime, timedelta
import pandas as pd

start_date = datetime.strptime("2018-01-01", "%Y-%m-%d")
date_range = pd.date_range(start_date, periods=365).tolist()

for d in date_range:
    # collect one days' worth of data
    end_date = (d.date() + timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S")

    params = (
        ('aggregateHours', '1'),
        ('combinationMethod', 'aggregate'),
        ('startDateTime', datetime.strftime(d.date(), "%Y-%m-%dT%H:%M:%S")),
        ('endDateTime', end_date),
        ('maxStations', '-1'),
        ('maxDistance', '-1'),
        ('contentType', 'csv'),
        ('unitGroup', 'metric'),
        ('locationMode', 'single'),
        ('dataElements', 'default'),
        ('locations', 'Dublin, Ireland'),
        ('key', "9LQ497XC5G428MLSNQ4E6A4G4")
    )

    response = requests.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history', params=params)

    if "exceeded" in str(response.content):
        print(response.content)
        print("Exiting")
        exit(1)
    else:
        with open(f'visualcrossing_hourly_Dublin_{d.date()}.csv', 'wb') as csv_file:
            csv_file.write(f"visual_cross_data/{response.content}")

