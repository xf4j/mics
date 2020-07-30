FROM ubuntu:18.04
COPY ./server /mics/server
COPY ./nginx /mics/nginx
COPY ./orthanc /mics/orthanc
COPY ./*.sh /mics/
ENV DJANGO_DEBUG False
ENV DJANGO_SECRET_KEY micsapp
ENV ORTHANC_CONFIG_FILE /mics/orthanc/orthanc.json
RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y --no-install-recommends python3 python3-pip nginx libgomp1 tzdata vim
RUN pip3 install setuptools wheel && pip3 install -r /mics/server/requirements.txt
RUN systemctl daemon-reload
RUN systemctl restart gunicorn
RUN systemctl enable gunicorn
RUN chmod u+x /mics/prepare.sh
EXPOSE 80 3200 8042 4242 8000
CMD ["bash", "/mics/run.sh"]