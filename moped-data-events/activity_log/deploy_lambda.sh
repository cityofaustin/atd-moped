#!/bin/bash

cd venv/lib/python3.8/site-packages
zip -r9 ${OLDPWD}/lambda.zip .
cd $OLDPWD
zip -g lambda.zip app.py config.py MopedEvent.py
aws lambda update-function-code --function-name atd-moped-events-activity_log_test --zip-file fileb://lambda.zip