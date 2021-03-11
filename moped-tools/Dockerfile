#
# Moped Migration Tool
#
FROM python:3.8-slim-buster
# Install MDB Tools
RUN apt-get update && apt-get install mdbtools -y
# Install requests for GraphQL access
RUN pip install requests

COPY . /app
WORKDIR /app
