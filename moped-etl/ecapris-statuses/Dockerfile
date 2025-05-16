FROM ghcr.io/oracle/oraclelinux8-instantclient:19

WORKDIR /app
COPY . /app

RUN dnf update && dnf install -y python39 python39-pip
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
