# MOPED - ETL

These are programs intended to be used for scheduled tasks related to transferring data into and out of Moped. These programs come in the form of Python scripts intended to be run inside a Docker container. The Dockerfile needed to build the image used for the container is included.

## Getting Started
#### 1) Download the environment file
The ETL container needs information about specific details about your graphql-engine endpoint and some field codes assigned by Knack for the Data Tracker instance you're targeting. These details are passed into the container as environment variables and are defined in an environment file. The environment file for local development is available in 1Password's Developer section under the title "Local Development Moped ETL ENV file." Download this file and place it in the `moped-etl` folder. You can name it something that's memorable to you, but the following instructions will use the name `local_moped_dev_knack.env.` Do not commit this file into git. Files ending in `.env` are automatically ignored via `.gitignore`, so it is strongly recommended that you use a filename ending in that suffix.

If you are working in a shared environment, protect the file to being read-only by your user account. This can be accomplished using the `chmod 600 <filename>` command in your terminal. 

#### 2) Build the image
Execute the following to build the ETL image: `docker build -t atd-moped-etl --no-cache .` 

If you are developing the image itself, the `--no-cache` argument can be removed. It is useful when you may have old intermediate layers to your image, that may contain manifests of software available apk, dpkg, yum or other package management systems.



Example local dev environment invocation: `docker run -it --rm -p 5555:5555 -v $(pwd)/app:/app -v $(pwd)/data:/data --env-file local_moped_dev_knack.env --env HASURA_ENDPOINT=http://$(./get_ip.sh):8080/v1/graphql atd-moped-etl bash`