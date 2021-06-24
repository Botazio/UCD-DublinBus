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
