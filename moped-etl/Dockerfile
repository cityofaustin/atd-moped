#
# ATD Moped Processsor
# An ETL Processor that uses Python 3.8
#
FROM python:3.8-alpine3.10

RUN mkdir /app && mkdir /app/tmp && mkdir /data

RUN apk add bash build-base python3-dev vim

RUN pip install requests awscli web-pdb sodapy boto3 knackpy

WORKDIR /app

COPY app /app

EXPOSE 5555/tcp

CMD ["bash"]