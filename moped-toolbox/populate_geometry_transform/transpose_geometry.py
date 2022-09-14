#!/usr/bin/python3

import os

import psycopg2
import psycopg2.extras

DB_HOST = os.environ.get("DB_HOST", "host.docker.internal")
DB_USER = os.environ.get("DB_USER", "moped")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "moped")
DB_NAME = os.environ.get("DB_NAME", "moped")

pg = psycopg2.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, dbname=DB_NAME)
