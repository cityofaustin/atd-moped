FROM ubuntu:22.04
RUN apt-get update
RUN apt-get install -y python3 python3-pip aptitude magic-wormhole vim python3-psycopg2
WORKDIR /tmp
COPY ./requirements.txt /tmp/requirements.txt
RUN pip install -r requirements.txt
WORKDIR /root/app
