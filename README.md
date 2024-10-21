# Moped

### A comprehensive project tracking platform for Austin's mobility projects

🛵 🗺 👷 🚌 🚧 🚴 📊

## Resources

- [About](https://austinmobility.io/products/5086)
- [Documentation](https://atd-dts.gitbook.io/moped-documentation)
- [Backlog](https://github.com/cityofaustin/atd-data-tech/issues?q=is%3Aopen+label%3A%22Product%3A+Moped%22+-label%3A%22Workgroup%3A+TPW%22)

## Environments

- Production: [https://mobility.austin.gov/moped/](https://mobility.austin.gov/moped/)
- Staging: [https://moped.austinmobility.io/moped/](https://moped.austinmobility.io/moped/)
- Test: [https://moped-test.austinmobility.io/moped/](https://moped-test.austinmobility.io/moped/)

For resources and updates, see the [Mobility Project Database project index](https://github.com/cityofaustin/atd-data-tech/issues/307).

![Post-it notes of users' desired Moped functionality and outcomes](https://user-images.githubusercontent.com/1463708/62583080-58614e80-b874-11e9-850d-2a8bda07c0fc.jpeg)

## Quick start

Welcome to the 🛵 Moped codebase! Below is a step-by-step guide to help you get started by setting up the Moped environment.

### Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Git**: To clone the repository.
- **Docker**: Moped uses Docker for container management.
- **Hasura CLI**: Required for managing the Hasura cluster.

### Setting Up Moped

1. **Install Hasura CLI**

   - Install the Hasura CLI by running the following command:

     ```bash
     curl -L <https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh> | bash

     ```

   - Ensure it installs version `2.42.0` or later.

2. **Start the Hasura Cluster**

   - Navigate to the `moped-database` directory:

     ```bash
     cd moped-database

     ```

   - Start the Hasura cluster using Docker:

     ```bash
     ./hasura-cluster start

     ```

   - If you encounter errors related to migrations, you can try the following:

     ```bash
     ./hasura_cluster start_only
     ./run_migrations
     ./hasura-cluster start

     ```

3. **Run the Frontend React App**

   - Navigate to the `moped-editor` directory:

     ```bash
     cd moped-editor

     ```

   - Install the necessary npm packages:

     ```bash
     npm install

     ```

   - Start the frontend development server:

     ```bash
     npm start

     ```

   - The application should open in your browser at `https://localhost:3000/moped`.

### Troubleshooting

- **Logging in**: The SSO Button is expected to be disabled in the local environment. Use the external user sign-in option instead and request test credentials from a team member.

## Learn more

- [Database](./moped-database/README.md) - the database that powers the Mobility Project Database suite
- [Editor](./moped-editor/README.md) - web application which enables City staff to browse and edit mobility project data
- [ArcGIS Moped Database Viewer](https://austin.maps.arcgis.com/apps/webappviewer/index.html?id=404d31d56b57491abe53ccfd718fcaee) - GIS map application that includes Moped Project Data as a layer (requires ArcGIS Online permissions)
- [API](./moped-api/README.md) - serverless Flask API, handling data operations and API requests
- [auth](./moped-auth/README.md) - manages authentication using AWS Cognito, including JWT token generation and validation for secure access control
- [etl](./moped-etl/README.md) - integration scripts for ArcGIS & Knack Data Tracker
- [toolbox](./moped-toolbox/README.md) - collection of utilities and scripts designed for ad-hoc maintenance tasks

## License

As a work of the City of Austin, this project is in the public domain within the United States.

Additionally, we waive copyright and related rights of the work worldwide through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

Built by [Data & Technology Services](https://austinmobility.io/) at [Austin Transportation & Public Works](https://www.austintexas.gov/department/transportation-public-works)
