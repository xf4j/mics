#!/bin/bash

# # Start orthanc
# # Do not overwrite
mkdir -p /storage/orthanc
cp -f /mics/orthanc/orthanc.json /storage/orthanc/orthanc.json
/mics/orthanc/Orthanc /storage/orthanc/orthanc.json &

# Start gunicorn
# To-do: check the system core and set the number of workers correspondingly
mkdir -p /storage/mics
cp -n /mics/server/db.sqlite3 /storage/mics/db.sqlite3
mkdir -p /storage/gunicorn
cd /mics/server
gunicorn -w 4 -t 3600 /storage/gunicorn/error server.wsgi &

# Start nginx
nginx -g 'daemon off;'
 