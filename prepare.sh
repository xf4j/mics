#!/bin/bash
# static files
cd /mics/server
python3 manage.py collectstatic --noinput

# nginx configs
cp -rf /mics/nginx/* /etc/nginx/
