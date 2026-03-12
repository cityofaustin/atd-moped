# transpose component geometries

## local run

1. Start the Hasura cluster [with production data](https://app.gitbook.com/o/-LzDQOVGhTudbKRDGpUA/s/-MIQvl_rKnZ_-wHRdp4J/dev-guides/how-tos/how-to-load-production-data-into-a-local-instance).

2. Build the docker image

```
$ docker build -t geomtransform .
```

3. Run the script, mounting your local copy of this directory into the container.

```
$ docker run -it --rm -v "$(pwd)":/app geomtransform python3 transpose_geometry.py
```
