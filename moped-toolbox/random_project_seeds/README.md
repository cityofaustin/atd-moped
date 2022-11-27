# Seed Moped with random projects

This utility creates random projects in Moped.

## Get it running

1. Start the Hasura cluster and Editor:

```shell
# ./moped-database
$ ./hasura-cluster start

# ./moped-editor
$ npm run start
```

2. From this directory, install dependencies:

```shell
# ./moped-toolbox/random_project_seeds
$ npm install
```

1. Modify `./settings.js` to configure the number of projects and related recods which will be created. 500 projects is good place to start. 3,000 projects would mimic our post-access migration production environment. 10,000 projects will have interesting results - **Warning** It may be adviseable to disable activity log event triggers before inserting more than a few hundred projects.

2. Run the script to seed the DB. The script will delete any existing projects in the database before creating new ones.

```shell
$ node index.js
```

3. Open the Moped Editor to view the projects ✨
