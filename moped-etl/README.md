# MOPED - ETL

These are programs intended to be used for scheduled tasks related to transferring data into and out of Moped. These programs come in the form of Python scripts intended to be run inside a Docker container. The Dockerfile needed to build the image used for the container is included.

This ETL environment is modeled after the [ATD Vision Zero ETL environment](https://github.com/cityofaustin/atd-vz-data/atd-etl).

## Getting Started
#### 1) Download the environment file
The ETL container needs information about specific details about your graphql-engine endpoint and some field codes assigned by Knack for the Data Tracker instance you're targeting. These details are passed into the container as environment variables and are defined in an environment file. The environment file for local development is available in 1Password's Developer section under the title "Local Development Moped ETL ENV file." Download this file and place it in the `moped-etl` folder. You can name it something that's memorable to you, but the following instructions will use the name `local_moped_dev_knack.env.` Do not commit this file into git. Files ending in `.env` are automatically ignored via `.gitignore`, so it is strongly recommended that you use a filename ending in that suffix.

If you are working in a shared environment, protect the file to being read-only by your user account. This can be accomplished using the `chmod 600 <filename>` command in your terminal. 

#### 2) Build the image
Execute the following to build the ETL image: `docker build -t atd-moped-etl --no-cache .` 

If you are developing the image itself, the `--no-cache` argument can be removed. It is useful when you may have old intermediate layers to your image, that may contain manifests of software available apk, dpkg, yum or other package management systems.

#### 3) Development of ETL scripts
You can start the container using the following command for local development.

`docker run -it --rm -p 5555:5555 -v $(pwd)/app:/app -v $(pwd)/data:/data --env-file local_moped_dev_knack.env --env HASURA_ENDPOINT=http://$(./get_ip.sh):8080/v1/graphql atd-moped-etl bash`

There is an important difference between local development of Moped ETL scripts and how they will run in production. In production, the graphql-engine endpoint will be known and will have a fixed IP or hostname. It will be defined in the environment file along with all the other specifics about the deployment. 

Local development has a complication however. It is likely that you will be self hosting the graphql-engine endpoint on your local machine. Outside of the container, you likely are referring to that endpoint using the `localhost` hostname. However, inside the container itself, `localhost` points to the local network interface of the container, which is separate and apart from the host's `localhost.` Because the container does not have knowledge of the network configuration of the host, the IP where the graphql-endpoint can be found must be explicitly supplied to the container, again through the use of environment variables. A bash script is provided, `get_ip.sh`, which will return the IP assigned to the active network interface or the interface currently holding the broadcast flag. To confirm that this is returning the IP you want to pass to the container as part of the graphql-engine endpoint, execute the script and substitute the IP into the URL seen in the above command. This URL should return a JSON object, likely with an error stating "resource does not exist." While it does indicate an error, that error pertains to the malformed query sent to the endpoint, and the fact that an error was returned at all indicates the graphql-engine endpoint is available on that network IP. 

**Note**: The `get_ip.sh` script is written to support Apple's version of `ifconfig`, and it may need modification to work on other platforms.

#### 4) Debugging
The python environment should support Web-PDB based debugging, but this is untested. Please see the debugging section in this [README.md](https://github.com/cityofaustin/atd-vz-data/blob/master/atd-etl/README.md) file for more information. 

## ETL Scripts

* app/moped_data-tracker_sync_projects.py: Query Moped's graphql-engine endpoint and find all projects which have a recorded knack ID, indicating that they have been synchronized to Knack by a user. Similarly, query all projects in Knack's Data Tracker application. Iterate over the Moped dataset and comparing it to the connected record in Knack. For each record with differing data, update Knack to match the current data found in Moped. 