FROM ghcr.io/oracle/oraclelinux9-instantclient:23

WORKDIR /app
COPY . /app

RUN dnf update && dnf install -y python3.12 python3.12-pip
RUN pip3.12 install --upgrade pip
RUN pip3.12 install -r requirements.txt
