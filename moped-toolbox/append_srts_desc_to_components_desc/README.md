# Append Safe Routes to Schools info to project component descriptions

## Running locally

1. Start the Hasura cluster [with production data](https://app.gitbook.com/o/-LzDQOVGhTudbKRDGpUA/s/-MIQvl_rKnZ_-wHRdp4J/dev-guides/how-tos/how-to-load-production-data-into-a-local-instance).

2. Use `secrets_template.py` as a template to create `secrets.py`

3. Create a virtual environment, install requirements.txt, and run:

```
$ python append_srts_desc.py
```
