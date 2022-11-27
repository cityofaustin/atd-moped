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

3. Modify `./settings.js` to configure the number of projects and related recods which will be created.

4. Run the script to seed the DB. The script will delete any existing projects in the database before creating new ones.

```shell
$ node index.js
```

5. Open the Moped Editor to view the projects ✨
