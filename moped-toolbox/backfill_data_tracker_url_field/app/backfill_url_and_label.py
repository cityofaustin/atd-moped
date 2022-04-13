#!/usr/bin/python3

import os

import knackpy
import psycopg2

moped = psycopg2.connect(host=os.getenv('MOPED_RR_HOSTNAME'), database=os.getenv('MOPED_RR_DATABASE'), user=os.getenv('MOPED_RR_USERNAME'), password=os.getenv('MOPED_RR_PASSWORD'))

