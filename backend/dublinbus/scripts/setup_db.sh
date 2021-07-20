#!/bin/bash
# setup_db.sh

# monadic function - filepath to the django project root directory e.g. '/home/team13/UCD-DublinBus/backend'
# dependencies	
#	env variables -  AWS_MYSQL_PASSWORD 
# 	anaconda / miniconda installed.
#	dublinbusenv virtual environemnt with requirements.txt installed (dbbackup, sqlite3-to-mysql etc.)
# 	make file executable - chmod +x setup_db.sh

# crontab to run at midnight everyday
# 0 0 * * * /home/team13/UCD-DublinBus/backend/dublinbus/scripts/setup_db.sh '/home/team13/UCD-DublinBus/backend' >> /home/team13/UCD-DublinBus/backend/dublinbus/scripts/setup_db.log 2>&1

echo "setup_db.sh - starting"

# 1. 
echo "1. setup_db.sh - comparing calendar.txt files"

DJANGO_BACKEND="$1"
# GTFS_STATIC_DIR environmental variable used by setup_db.py 
export GTFS_STATIC_DIR="${DJANGO_BACKEND}/dublinbus/scripts/gtfs_static"
GTFS_STATIC_ZIP="https://www.transportforireland.ie/transitData/google_transit_dublinbus.zip"
mkdir -p "${GTFS_STATIC_DIR}"
touch "${GTFS_STATIC_DIR}"/calendar.txt
wget "${GTFS_STATIC_ZIP}" -P "${GTFS_STATIC_DIR}"/
unzip -p "${GTFS_STATIC_DIR}"/google_transit_dublinbus.zip calendar.txt > "${GTFS_STATIC_DIR}"/calendar_tmp.txt
diff --brief "${GTFS_STATIC_DIR}"/calendar.txt "${GTFS_STATIC_DIR}"/calendar_tmp.txt >/dev/null
comp_value=$?

if [ $comp_value -eq 0 ]
then
    rm "${GTFS_STATIC_DIR}"/calendar_tmp.txt "${GTFS_STATIC_DIR}"/google_transit_dublinbus.zip
    echo "setup_db.sh - no update to gtfs-static data (calendar.txt file has not changed) - exiting"
    exit 0
fi


echo "setup_db.sh - update to gtfs-static data (calendar.txt file has changed) - (re-)writing database"
unzip "${GTFS_STATIC_DIR}"/google_transit_dublinbus.zip -d "${GTFS_STATIC_DIR}"/data/

# 2. 
echo "2. setup_db.sh - backing up MySQL AWS database"
export DB=''
source "${HOME}"/anaconda3/etc/profile.d/conda.sh 	# or /miniconda3/
conda activate dublinbusenv
python "${DJANGO_BACKEND}"/manage.py dbbackup

# 3. 
echo "3. setup_db.sh - writing new gtfs-static data to local sqlite3 database"
export DB='local_sqlite3' 
python "${DJANGO_BACKEND}"/manage.py shell < "${DJANGO_BACKEND}"/dublinbus/scripts/setup_db.py

# 4. 
echo "4. setup_db.sh - overwrite AWS databse with sqlite3 db file (db.sqlite3)"
AWS_MYSQL_PASSWORD="$(cat "${DJANGO_BACKEND}/backend/.env" | grep AWS_MYSQL_PASSWORD | cut -d= -f2)"
sqlite3mysql --sqlite-file "${DJANGO_BACKEND}"/db.sqlite3 --mysql-user=admin --mysql-password="${AWS_MYSQL_PASSWORD}" --mysql-database=dublinbus --mysql-host=dublin-bus.caghf9c2wznv.eu-west-1.rds.amazonaws.com

# 5. 
echo "5. setup_db.sh - remove raw / temp files"
# Move the calendar.txt file into the gtfs_static directory for tomorrow's comparison
mv "${GTFS_STATIC_DIR}"/data/calendar.txt "${GTFS_STATIC_DIR}"/
# Remove raw csv files from server after being saved into database
rm -r "${GTFS_STATIC_DIR}"/data/
rm "${GTFS_STATIC_DIR}"/calendar_tmp.txt "${GTFS_STATIC_DIR}"/google_transit_dublinbus.zip

echo "setup_db.sh - finishing"
