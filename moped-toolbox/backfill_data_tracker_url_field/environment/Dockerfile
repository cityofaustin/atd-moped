FROM ubuntu:focal
RUN apt-get update
RUN apt-get -y upgrade 
RUN apt-get install -y aptitude vim procps
RUN apt-get install -y python3 pip python3-psycopg2 black
RUN pip install knackpy
WORKDIR /root/app
CMD ["tail", "-f", "/dev/null"]
