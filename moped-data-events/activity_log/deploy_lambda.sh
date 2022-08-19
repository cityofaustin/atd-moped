#!/bin/bash


rm -frv ./activity_log
python3 -m venv ./activity_log
source ./activity_log/bin/activate
pip install -r requirements.txt
deactivate
cd activity_log/activity_log/lib/python3.8/site-packages
zip -qr ../../../../activity_log.zip .
cd ../../../../
zip -qg ./activity_log.zip app.py config.py MopedEvent.py
aws lambda update-function-code --function-name franks-event-handler-test --zip-file fileb://activity_log.zip

#cd venv/lib/python3.8/site-packages
#zip -r9 ${OLDPWD}/lambda.zip .
#cd $OLDPWD
#zip -g lambda.zip app.py config.py MopedEvent.py
#aws lambda update-function-code --function-name atd-moped-events-activity_log_test --zip-file fileb://lambda.zip


