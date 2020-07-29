#!/bin/bash

# # Start orthanc
# # Do not overwrite
mkdir -p /storage/orthanc

# Start gunicorn
# To-do: check the system core and set the number of workers correspondingly
mkdir -p /storage/mics
cp -n /mics/server/db.deploy.sqlite3 /storage/mics/db.sqlite3
mkdir -p /storage/gunicorn
cd /mics/server
gunicorn -w 4 -t 3600 --access-logfile /storage/gunicorn/access --error-logfile /storage/gunicorn/error server.wsgi &

# Start nginx
nginx -g 'daemon off;'
