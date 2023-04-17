FROM python:3.8-slim
EXPOSE 5000
# We copy just the requirements.txt first to leverage Docker cache
COPY requirements/development.txt /app/requirements.txt

RUN apt-get update
RUN apt-get install -y gcc python3-dev

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app

CMD [ "python", "app.py" ]
