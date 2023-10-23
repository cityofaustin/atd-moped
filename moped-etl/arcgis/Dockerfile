FROM python:3.11-slim

# Copy our own application
WORKDIR /app
COPY . /app

RUN chmod -R 755 /app/*

# Proceed to install the requirements...do
RUN cd /app && apt-get update && \
    pip install -r requirements.txt
