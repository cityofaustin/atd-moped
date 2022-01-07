# MOPED - ETL

These are programs intended to be used for scheduled tasks related to transferring data into and out of Moped. These programs come in the form of Python scripts intended to be run inside a Docker container. The Dockerfile needed to build the image used for the container is included.

This ETL environment is modeled after the [ATD Vision Zero ETL environment](https://github.com/cityofaustin/atd-vz-data/atd-etl).

## Getting Started
#### 1) Download the environment file
The ETL container needs information about specific details about your graphql-engine endpoint and some field codes assigned by Knack for the Data Tracker instance you're targeting. These details are passed into the container as environment variables and are defined in an environment file. The environment file for local development is available in 1Password's Developer section under the title "Local Development Moped ETL ENV file." Download this file and place it in the `moped-etl` folder. You can name it something that's memorable to you, but the following instructions will use the name `local_moped_dev_knack.env.` Do not commit this file into git. Files ending in `.env` are automatically ignored via `.gitignore`, so it is strongly recommended that you use a filename ending in that suffix.

If you are working in a shared environment, protect the file to being read-only by your user account. This can be accomplished using the `chmod 600 <filename>` command in your terminal. 

#### 2) Build the image
Execute the following to build the ETL image: `docker build -t atd-moped-etl --no-cache .` 

If you are developing the image itself, the `--no-cache` argument can be removed. It is useful when you may have old intermediate layers to your image, that may contain manifests of software available apk, dpkg, yum or some other package management systems.

#### 2.1) Python Requirements
A folder exists named `requirements` in the `moped-etl` directory. Any file placed in this folder will be interpreted as a requirements.txt file and run through `pip install -r [filename]` during the building of the Docker image. This is a replacement of the system where we were `pip install`ing libraries explicitly during the image build process. The intent is to provide a mechanism for a user to easily pull a single ETL app out of this docker context and have a requirements file that goes along with it should he or she wish to run the script in another, perhaps local, environment. 

#### 3) Development of ETL scripts
You can start the container using the following command for local development.

`docker run -it --rm -p 5555:5555 -v $(pwd)/app:/app -v $(pwd)/data:/data --env-file local_moped_dev_knack.env atd-moped-etl bash`

Please note, the graphql-engine console will indicate that the endpoint where you want to send your graphql queries is likely: `http://localhost:8080/v1/graphql`. The hostname "localhost," in this case, referrers to your computer, running the graphql-engine which is exposed on the port `8080`.  However, when you run the Moped ETL container, that container will have its own localhost, being the local address of the container, not the host machine. Because of this, the address used to access the graphql-engine endpoint, **from inside the ETL docker container**, needs to be configured in the environment variable file in a way similar to this entry: `HASURA_ENDPOINT=http://host.docker.internal:8080/v1/graphql`. The hostname `host.docker.internal` is a special hostname provided by the docker engine's DNS subsystem that points to localhost of the host computer, not the ETL container, which allows you to connect to services local to your machine, but outside of the guest container.

#### 4) Debugging
The python environment should support Web-PDB based debugging, but this is untested. Please see the debugging section in this [README.md](https://github.com/cityofaustin/atd-vz-data/blob/master/atd-etl/README.md) file for more information. 

## ETL Scripts

* app/moped_data-tracker_sync_projects.py: Query Moped's graphql-engine endpoint and find all projects which have a recorded knack ID, indicating that they have been synchronized to Knack by a user. Similarly, query all projects in Knack's Data Tracker application. Iterate over the Moped dataset and comparing it to the connected record in Knack. For each record with differing data, update Knack to match the current data found in Moped. 