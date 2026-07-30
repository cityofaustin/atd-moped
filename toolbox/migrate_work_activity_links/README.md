This directory houses a one time use python script written in service of completing issue [29136](https://github.com/cityofaustin/atd-data-tech/issues/29136), "Migrate work activity links to be work activity attachments".


### Usage/Testing

1. Create venv 
```bash
python3 -m venv ./venv
```
```bash
source venv/bin/activate
```
```bash
pip install -r requirements.txt
```

2. `cp secrets_template.py secrets.py`, fill out secrets file with appropriate variables
3. Spin up local moped database
3. `python run.py -n` to do a dry run locally. 
    To run in production, `python run.py -e prod`