FROM ubuntu:latest
RUN apt-get update; apt-get install -y vim aptitude libdbi-perl libdbd-pg-perl

COPY script /root/
WORKDIR /root/
CMD tail -f /dev/null
