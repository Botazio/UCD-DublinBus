import sys, os, django, re, subprocess
from pathlib import Path
from datetime import datetime
from csv import reader
import pandas as pd

from dublinbus.models import Stop, Route, Trip, StopTime, Calendar, Line

# i. compare calendar.txt files
GTFS_STATIC_DIR = os.path.abspath(os.path.dirname(__name__)) + "/dublinbus/scripts/gtfs_static"
os.system('mkdir -p {}'.format(GTFS_STATIC_DIR))
os.system('touch {}/calendar.txt'.format(GTFS_STATIC_DIR))
os.system('wget https://www.transportforireland.ie/transitData/google_transit_dublinbus.zip -P {}/'.format(GTFS_STATIC_DIR))
os.system('unzip -p {0}/google_transit_dublinbus.zip calendar.txt > {0}/calendar_tmp.txt'.format(GTFS_STATIC_DIR))
compare_calendars = subprocess.check_output("diff {0}/calendar.txt {0}/calendar_tmp.txt; exit 0".format(GTFS_STATIC_DIR),stderr=subprocess.STDOUT,shell=True)

# if there is no difference between the newly downloaded calendar.txt file and the previous one then exit
if len(compare_calendars) == 0:
    os.system('rm {0}/calendar_tmp.txt {0}/google_transit_dublinbus.zip'.format(GTFS_STATIC_DIR))
    print("No update to calendar.txt file - exiting")
    exit()

print("Update to calendar.txt file - (re-)writing database")
os.system('unzip {0}/google_transit_dublinbus.zip -d {0}/data/'.format(GTFS_STATIC_DIR))

# ii. Deleting all records in database (without violation / integrity checks foreign keys, order of deletion matters, delete FK first)
Line.objects.all().delete() # FK stop
StopTime.objects.all().delete() # FK trip, FK stop
Trip.objects.all().delete() # PK trip_id , FK route, FK calendar
Calendar.objects.all().delete() # PK service_id
Stop.objects.all().delete() # PK stop_id
Route.objects.all().delete() # PK route_id

# iii. Ingest GTFS-static data
# order of ingestion the inverse to deletion - populate tables with PKs first before ones with FKs
# Calendar -> Stop -> Route -> Trip -> StopTime -> Line
# a. Save raw txt files into database
with open('{}/data/calendar.txt'.format(GTFS_STATIC_DIR), 'r') as calendar_file:

    csv_reader = reader(calendar_file)

    # skip header
    next(csv_reader, None)

    for row in csv_reader:
        print(row)
        c = Calendar(
            service_id=row[0],
            monday=True if row[1] == "1" else False,
            tuesday=True if row[2] == "1" else False,
            wednesday=True if row[3] == "1" else False,
            thursday=True if row[4] == "1" else False,
            friday=True if row[5] == "1" else False,
            saturday=True if row[6] == "1" else False,
            sunday=True if row[7] == "1" else False,
            start_date=datetime.strptime(row[8], '%Y%m%d'),
            end_date=datetime.strptime(row[9], '%Y%m%d')
        )

        c.save()

    
with open('{}/data/stops.txt'.format(GTFS_STATIC_DIR), 'r') as stops_file:
    csv_reader = reader(stops_file)

    # skip header
    next(csv_reader, None)

    for row in csv_reader:
        print(row)

        try:
            stop_num = int(row[1].split(" ")[-1])
        except ValueError:
            # stop number isn't in the name
            # try parse out of ID instead
            stop_num = int(row[0].split("DB")[-1])

        s = Stop(
            stop_id=row[0],
            stop_name=row[1],
            stop_num=stop_num,
            stop_lat=float(row[2]),
            stop_lon=float(row[3])
        )

        s.save()

with open('{}/data/routes.txt'.format(GTFS_STATIC_DIR), 'r') as routes_file:

    csv_reader = reader(routes_file)

    # skip header
    next(csv_reader, None)

    for row in csv_reader:
        print(row)
        r = Route(
            route_id=row[0],
            agency_id=row[1],
            route_short_name=row[2],
            route_long_name=row[3],
            route_type=int(row[4])
        )

        r.save()


with open('{}/data/trips.txt'.format(GTFS_STATIC_DIR), 'r') as trips_file:

    csv_reader = reader(trips_file)

    # skip header
    next(csv_reader, None)

    for row in csv_reader:
        print(row)

        t = Trip(
            trip_id=row[2],
            shape_id=row[3],
            trip_headsign=row[4],
            direction_id=int(row[5]),
            route=Route.objects.get(route_id=row[0]),
            calendar=Calendar.objects.get(service_id=row[1])
        )

        t.save()


with open('{}/data/stop_times.txt'.format(GTFS_STATIC_DIR), 'r') as stop_times_file:

    csv_reader = reader(stop_times_file)

    # skip header
    next(csv_reader, None)

    for row in csv_reader:
        print(row)
        arrival_time = row[1]
        departure_time = row[2]

        # raw Dublin Bus data contains invalid times such as 24:00, 25:00, etc.
        r = re.compile("2[4-6]:[0-9][0-9]:[0-9][0-9]")
        if r.match(row[1]):
            arrival_time = row[1].replace("24", "00", 1)
        if r.match(row[2]):
            departure_time = row[2].replace("24", "00", 1)

        r = re.compile("25:[0-9][0-9]:[0-9][0-9]")
        if r.match(row[1]):
            arrival_time = row[1].replace("25", "01", 1)
        if r.match(row[2]):
            departure_time = row[2].replace("25", "01", 1)

        r = re.compile("26:[0-9][0-9]:[0-9][0-9]")
        if r.match(row[1]):
            arrival_time = row[1].replace("26", "02", 1)
        if r.match(row[2]):
            departure_time = row[2].replace("26", "02", 1)

        r = re.compile("27:[0-9][0-9]:[0-9][0-9]")
        if r.match(row[1]):
            arrival_time = row[1].replace("27", "03", 1)
        if r.match(row[2]):
            departure_time = row[2].replace("27", "03", 1)

        r = re.compile("28:[0-9][0-9]:[0-9][0-9]")
        if r.match(row[1]):
            arrival_time = row[1].replace("28", "04", 1)
        if r.match(row[2]):
            departure_time = row[2].replace("28", "04", 1)

        r = re.compile("29:[0-9][0-9]:[0-9][0-9]")
        if r.match(row[1]):
            arrival_time = row[1].replace("29", "05", 1)
        if r.match(row[2]):
            departure_time = row[2].replace("29", "05", 1)

        try:
            st = StopTime(
                arrival_time = arrival_time,
                departure_time = departure_time,
                stop_sequence = int(row[4]),
                stop_headsign = row[5],
                pickup_type = int(row[6]),
                drop_off_type = int(row[7]),
                shape_dist_traveled = float(row[8]),
                trip = Trip.objects.get(trip_id=row[0]),
                stop = Stop.objects.get(stop_id=row[3])
            )

            st.save()

        except Trip.DoesNotExist as trip_not_exist:
            continue


# b. creating tables from database data
# def create_lines():
# Line depends on Stop, StopTime, Trip and Route data
def get_lines(stop_id):
    """
    Args
        stop_id
    Returns
        List of distinct bus lines that pass through given stop.
    """
    print(stop_id)
    trip_ids_qs = StopTime.objects.filter(stop_id=stop_id).values('trip__route__route_short_name')
    trip_ids = pd.DataFrame(list(trip_ids_qs))
    return trip_ids["trip__route__route_short_name"].unique()

stops = list(Stop.objects.values())

for stop in stops:

    lines = get_lines(stop['stop_id'])

    for line in lines:
        l = Line(
            stop=Stop.objects.get(stop_id=stop['stop_id']),
            line=line
        )

        l.save()
        
        
# iv. Delete raw txt files after ingestion 
print("Deleting all GTFS static files except calendar.txt")
# Move the calendar.txt file into the gtfs_static directory for tomorrow's comparison
os.system('mv {0}/data/calendar.txt {0}/'.format(GTFS_STATIC_DIR))
# Remove raw csv files from server after being saved into database
os.system('rm -r {}/data/'.format(GTFS_STATIC_DIR))
os.system('rm {0}/calendar_tmp.txt {0}/google_transit_dublinbus.zip'.format(GTFS_STATIC_DIR))