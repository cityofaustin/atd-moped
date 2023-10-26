#
# ATD Moped Processsor
# An ETL Processor that uses Python 3.8
#
FROM python:3.8-alpine3.10

RUN mkdir /app && mkdir /app/tmp && mkdir /data

RUN apk add bash build-base python3-dev vim

RUN mkdir /requirements
COPY requirements /requirements
# Add a new <app_name>_requirements.txt in the requirements folder to have the app's 
# libraries installed at image build time.
RUN ls -1 /requirements/ | xargs -I {} pip install -r /requirements/{}

WORKDIR /app

COPY app /app


EXPOSE 5555/tcp

CMD ["bash"]
