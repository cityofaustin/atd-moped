# Moped Editor

Web application for interacting with Moped data.

## Quick start

1. Clone this repo. Start new branches from `main`.

2. Follow [steps](https://github.com/cityofaustin/atd-moped/tree/main/moped-database#readme) to start the Moped database.

3. Copy the environment variables template and fill in the values from the DTS password store. You will see the [MUI X Missing license key warning](https://v7.mui.com/x/introduction/licensing/#1-missing-license-key) without the MUI X environment variable.

```shell
cp env_template .env
```

4. We use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to keep our `node` versions in sync with our environments. With `nvm` installed, run `nvm use` from this directory to activate the current `node` and `npm` version required for this project. If you don't want to use `nvm`, refer to the `.nvmrc` file for the `node` version you should install.

5. Install dependencies: `npm install`

6. Start the server: `npm run start`

7. Open `https://localhost:3000/moped`

8. To login, locate the username and pw in the DTS password store under the name "Moped Local Editor User Login."
