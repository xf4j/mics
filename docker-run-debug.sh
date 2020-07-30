#!/bin/bash
# net=host is only available on Linux system
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    docker run -it -e TZ=America/New_York -v `pwd`/storage:/storage -v `pwd`/server:/server --net=host --rm mics bash
else
    docker run -it -e TZ=America/New_York -v `pwd`/storage:/storage -v `pwd`/server:/server -p 8000:8000 -p 3200:3200 -p 80:80 -p 8042:8042 --rm mics bash
fi
