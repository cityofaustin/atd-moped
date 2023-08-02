/**
 * Helper to copy users from one env to another
 */
const generator = require("generate-password");
const { gql } = require("graphql-request");
const { makeHasuraRequest, HASURA_AUTH } = require("./utils/graphql");
const { saveJsonFile, loadJsonFile } = require("./utils/loader");

const SESSION_TOKEN ="<jwt token from user session>"

const MOPED_USER_QUERY = gql`
  query Users {
    moped_users {
      first_name
      last_name
      title
      email
      workgroup_id
    }
  }
`;

const INSERT_MOPED_USERS_MUTATION = gql`
  mutation CreateUseers($users: [moped_users_insert_input!]!) {
    insert_moped_users(objects: $users) {
      affected_rows
    }
  }
`;

async function getUsers(env) {
  /**
   * Saves a copy of current moped users to json file.
   */
  const userData = await makeHasuraRequest({
    query: MOPED_USER_QUERY,
    env,
  });
    // const fname = `./moped_users_${env}.json`;
    // saveJsonFile(fname, userData.moped_users);
  return userData.moped_users;
}

const makeUserObject = ({ login_user, ...userProps }, isLoginUser) => {
  const user = { ...userProps };
  if (isLoginUser) {
    user.password = generator.generate({
      length: 30,
      numbers: true,
      symbols: true,
    });
    user.roles = ["moped-editor"];
  } else {
    user.roles = ["non-login-user"];
  }
  if (user.email.endsWith("austintexas.gov")) {
    user.is_coa_staff = true;
  }
  return user;
};

const makeLoginUserRequest = async ({ user, env }) => {
  const endpoint =
    env === "prod"
      ? "https://moped-api.austinmobility.io/users/"
      : "https://moped-api-staging.austinmobility.io/users/";

  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      Authorization: SESSION_TOKEN,
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    const text = await response.text();
    console.error(text);
    throw text;
  }
  data = await response.json();
  return data;
};

async function oneTimeUsersCreate(env) {
  const existingUsers = await getUsers(env);
  const usersRequired = loadJsonFile("./data/moped/one-time-user-import.json");
  const usersTodo = usersRequired.filter(
    (user) =>
      !existingUsers.find(
        (eUser) => eUser.email.toLowerCase() === user.email.toLowerCase()
      )
  );

  /**
   * If not staging or prod, we do NOT want to create new login users, since we only have
   * cognito user pools for staging and prod
   */
  const loginUsersPayload = usersTodo
    .filter(
      (user) => user.login_user === "yes" && ["staging", "prod"].includes(env)
    )
    .map((user) => makeUserObject(user, true));

  const noLoginUsersPayload = usersTodo
    .filter(
      (user) => user.login_user !== "yes" || !["staging", "prod"].includes(env)
    )
    .map((user) => makeUserObject(user, false));

  for (let i = 0; i < loginUsersPayload.length; i++) {
    const user = loginUsersPayload[i];
    const result = await makeLoginUserRequest({ user, env });
    console.log(result);
  }

  const response = await makeHasuraRequest({
    query: INSERT_MOPED_USERS_MUTATION,
    variables: { users: noLoginUsersPayload },
    env,
  });
  console.log("NOLOGINRESPONSE", response);
}


oneTimeUsersCreate("local");

exports.getUsers = getUsers;
