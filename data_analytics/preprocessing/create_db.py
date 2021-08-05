import sqlite3
import pandas as pd

# Create db if it doesn't exist or connect to it if it does exist
with sqlite3.connect("/home/team13/db/database/DublinBusHistoric.db") as connection:
    c = connection.cursor()

    # vehicles
    c.execute("""DROP TABLE IF EXISTS vehicles""")
    c.execute("""CREATE TABLE vehicles(
        DAYOFSERVICE DATETIME NOT NULL,
        VEHICLEID INTEGER NOT NULL,
        DISTANCE INTEGER,
        MINUTES INTEGER,
        LASTUPDATE DATETIME,
        PRIMARY KEY (DAYOFSERVICE, VEHICLEID))
    """)
    vehicles_df = pd.read_csv('data/raw/rt_vehicles_DB_2018.txt', sep=";")
    columns = [
        'DAYOFSERVICE', 'VEHICLEID', 'DISTANCE', 'MINUTES', 'LASTUPDATE'
    ]
    c.executemany("""
        INSERT INTO vehicles(DAYOFSERVICE, VEHICLEID, DISTANCE, MINUTES, LASTUPDATE)
        VALUES(?, ?, ?, ?, ?)
    """, list(vehicles_df[columns].values))
    c.execute("CREATE INDEX DAYOFSERVICE_VEHICLES ON vehicles(DAYOFSERVICE)")
    connection.commit()

    # trips
    c.execute("""DROP TABLE IF EXISTS trips""")
    c.execute("""CREATE TABLE trips (
        "DAYOFSERVICE" DATETIME NOT NULL,
        "TRIPID" INTEGER NOT NULL,
        "LINEID" VARCHAR(10),
        "ROUTEID" VARCHAR(20),
        "DIRECTION" INTEGER,
        "PLANNEDTIME_ARR" INTEGER,
        "PLANNEDTIME_DEP" INTEGER,
        "ACTUALTIME_ARR" FLOAT,
        "ACTUALTIME_DEP" FLOAT,
        PRIMARY KEY ("DAYOFSERVICE", "TRIPID"))
    """)
    for chunk in pd.read_csv('data/raw/rt_trips_DB_2018.txt', sep=";", chunksize=10000):
        # Dropped columns from raw data
        # NOTE - populated but doesn't seem useful

        columns = [
            "DAYOFSERVICE",
            "TRIPID",
            "LINEID",
            "ROUTEID",
            "DIRECTION",
            "PLANNEDTIME_ARR",
            "PLANNEDTIME_DEP",
            "ACTUALTIME_ARR",
            "ACTUALTIME_DEP"
        ]
        c.executemany("""
            INSERT INTO trips(DAYOFSERVICE, TRIPID, LINEID, ROUTEID, DIRECTION,
            PLANNEDTIME_ARR, PLANNEDTIME_DEP, ACTUALTIME_ARR, ACTUALTIME_DEP)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, list(chunk[columns].values))
    c.execute("CREATE INDEX DAYOFSERVICE_TRIPS ON trips(DAYOFSERVICE)")
    connection.commit()

    # Leavetimes
    c.execute("""DROP TABLE IF EXISTS leavetimes""")
    c.execute("""CREATE TABLE leavetimes (
        "DAYOFSERVICE" DATETIME NOT NULL,
        "TRIPID" INTEGER NOT NULL,
        "PROGRNUMBER" INTEGER NOT NULL,
        "STOPPOINTID" INTEGER,
        "PLANNEDTIME_ARR" INTEGER,
        "PLANNEDTIME_DEP" INTEGER,
        "ACTUALTIME_ARR" INTEGER,
        "ACTUALTIME_DEP" INTEGER,
        "VEHICLEID" INTEGER,
        PRIMARY KEY ("DAYOFSERVICE", "TRIPID", "PROGRNUMBER"))
    """)
    for chunk in pd.read_csv('data/raw/rt_leavetimes_DB_2018.txt', sep=";", chunksize=10000):
        # Columns that are dropped from the raw data are:
        #
        columns = [
            "DAYOFSERVICE",
            "TRIPID",
            "PROGRNUMBER",
            "STOPPOINTID",
            "PLANNEDTIME_ARR",
            "PLANNEDTIME_DEP",
            "ACTUALTIME_ARR",
            "ACTUALTIME_DEP",
            "VEHICLEID"
        ]
        c.executemany("""
            INSERT INTO leavetimes(DAYOFSERVICE, TRIPID, PROGRNUMBER, STOPPOINTID, PLANNEDTIME_ARR,
            PLANNEDTIME_DEP, ACTUALTIME_ARR, ACTUALTIME_DEP, VEHICLEID)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, list(chunk[columns].values))
    c.execute("CREATE INDEX DAYOFSERVICE_LEAVETIMES ON leavetimes(DAYOFSERVICE)")
    connection.commit()

    # weather
    weather_df = pd.read_csv('data/raw/met_eireann_hourly_phoenixpark_jan2018jan2019.csv', sep=",")
    c.execute("""DROP TABLE IF EXISTS weather""")
    c.execute("""CREATE TABLE weather(DATE DATETIME NOT NULL,
        INDICATOR INTEGER,
        RAIN FLOAT,
        TEMP FLOAT,
        BULB_TEMP FLOAT,
        DEWPOINT_TEMP FLOAT,
        VAPOUR_PRESSURE FLOAT,
        RELATIVE_HUMIDITY INTEGER,
        PRESSURE FLOAT,
        PRIMARY KEY (DATE))""")
    columns = [
        "date",
        "ind",
        "rain",
        "temp",
        "wetb",
        "dewpt",
        "vappr",
        "rhum",
        "msl"
    ]
    c.executemany("""
        INSERT INTO weather(DATE, INDICATOR, RAIN, TEMP, BULB_TEMP,
        DEWPOINT_TEMP, VAPOUR_PRESSURE, RELATIVE_HUMIDITY, PRESSURE)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, list(weather_df[columns].values))
    c.execute("CREATE INDEX DATE_WEATHER ON weather(DATE)")
    connection.commit()
