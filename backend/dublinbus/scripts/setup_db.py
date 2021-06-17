from dublinbus.models import Stop, Route, Trip, StopTime
from csv import reader


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
        st = StopTime(
            arrival_time = row[1],
            departure_time = row[2],
            stop_id = row[3],
            stop_sequence = row[4],
            stop_headsign = row[5],
            pickup_type = int(row[6]),
            drop_off_type = int(row[7]),
            shape_dist_traveled = float(row[8]),
            trip = Trip.objects.get(trip_id=row[0])
        )

        st.save() 
