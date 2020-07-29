#!/bin/bash
# instead of opening multiple ports, just use host network
# However, make sure the host firewall allows these ports
# On linux, run these if ufw is active
# sudo ufw allow 3200
# sudo ufw allow 8042
# sudo ufw allow 4242
#
# install docker
# https://docs.docker.com/install/linux/docker-ce/ubuntu/
# 
# manager docker as a non-root user
# https://docs.docker.com/install/linux/linux-postinstall/

# Eastern: America/New_York
# Central: America/Chicago
# Mountain: America/Denver
# Pacific: America/Los_Angeles
# UTC: Etc/UTC
# UTC+1: Europe/Amsterdam
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    docker run -it -e TZ=America/New_York -v `pwd`/storage:/storage --net=host --rm springbok/mics
else
    docker run -it -e TZ=America/New_York -v `pwd`/storage:/storage -p 8000:8000 -p 3200:3200 -p 80:80 -p 8042:8042 --rm springbok/mics
fi