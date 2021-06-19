from csv import reader
import re
from dublinbus.models import Stop, Route, Trip, StopTime

with open('./data/DublinBusStaticGTFS/stops.txt', 'r') as stops_file:
    csv_reader = reader(stops_file)

    # skip header
    next(csv_reader, None)

    for row in csv_reader:
        print(row)
        s = Stop(
            stop_id=row[0],
            stop_name=row[1],
            stop_lat=float(row[2]),
            stop_lon=float(row[3])
        )

        s.save()

with open('./data/DublinBusStaticGTFS/routes.txt', 'r') as routes_file:

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


with open('./data/DublinBusStaticGTFS/trips.txt', 'r') as trips_file:

    csv_reader = reader(trips_file)

    # skip header
    next(csv_reader, None)

    for row in csv_reader:
        print(row)
        t = Trip(
            trip_id=row[2],
            service_id=row[1],
            shape_id=row[3],
            trip_headsign=row[4],
            direction_id=int(row[5])
        )

        t.route = Route.objects.get(route_id=row[0])

        t.save()


with open('./data/DublinBusStaticGTFS/stop_times.txt', 'r') as stop_times_file:

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

        st = StopTime(
            arrival_time = arrival_time,
            departure_time = departure_time,
            stop_id = row[3],
            stop_sequence = row[4],
            stop_headsign = row[5],
            pickup_type = int(row[6]),
            drop_off_type = int(row[7]),
            shape_dist_traveled = float(row[8]),
            trip = Trip.objects.get(trip_id=row[0])
        )

        st.save()
