FROM python:3.13-slim
EXPOSE 5000

RUN apt-get update
RUN apt-get install -y gcc python3-dev

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY . /app

CMD [ "python", "app.py" ]
