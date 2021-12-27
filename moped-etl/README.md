# MOPED - ETL

TODO: Expand this documentation and confer with dev team on how much we may want to borrow from the VZ ETL patterns

Example build command for docker image: `docker build -t atd-moped-etl --no-cache .`
Example local dev environment invocation: `docker run -it --rm -p 5555:5555 -v $(pwd)/app:/app -v $(pwd)/data:/data --env-file local_moped_dev_knack.env --env HASURA_ENDPOINT=http://$(./get_ip.sh):8080/v1/graphql atd-moped-etl bash`