const { gql } = require("graphql-request");
const { makeHasuraRequest } = require("./utils/graphql");
const { saveJsonFile } = require("./utils/loader");

const USERS_FNAME = "./data/moped/moped_users.json";

const MOPED_USER_QUERY = gql`
  query Users {
    moped_users {
      user_id
      first_name
      last_name
      title
      email
      workgroup_id
      is_coa_staff
      roles
      is_deleted
    }
  }
`;

const INSERT_MOPED_USERS_MUTATION = gql`
  mutation CreateUseers($users: [moped_users_insert_input!]!) {
    insert_moped_users(
      objects: $users
      on_conflict: {
        constraint: moped_users_pkey
        update_columns: [first_name, last_name, email, workgroup_id, title]
      }
    ) {
      affected_rows
    }
  }
`;

async function getUsers(env) {
  /**
   * Download current moped production users from Moped prod
   */
  const userData = await makeHasuraRequest({
    query: MOPED_USER_QUERY,
    env,
  });
  return userData.moped_users;
}

/**
 * Download all users from prod if env is local or test,
 * overwrite each user IDs to `1`
 */
async function downloadUsers(env) {
  const users = await getUsers(
    env === "test" || env === "local" ? "prod" : env
  );
  saveJsonFile(USERS_FNAME, users);
  return users;
}

const makeUserObject = ({
  email,
  first_name,
  last_name,
  title,
  user_id,
  workgroup_id,
  is_deleted,
}) => {
  const user = {
    email,
    first_name,
    last_name,
    title,
    user_id,
    workgroup_id,
    is_deleted,
  };
  user.roles = ["non-login-user"];
  return user;
};

async function createUsers(env) {
  if (env !== "local" && env !== "test") {
    throw `Only allowed in local and test`;
  }

  const users = await getUsers("prod");

  const payload = users.map((userData) => makeUserObject(userData));

  // add a JD user as ID 1: this works out well bc there is no user ID 1 in prod, and
  // this is JD's user ID in the staging user pool: so we can login to local or test
  // instance as JD and use the app without issue

  payload.push(
    makeUserObject({
      email: "jd@emailhost.xyz",
      first_name: "JD",
      last_name: "Maccombs",
      title: "Software Developer",
      user_id: 1,
      workgroup_id: 3,
      is_deleted: false,
    })
  );

  try {
    await makeHasuraRequest({
      query: INSERT_MOPED_USERS_MUTATION,
      variables: { users: payload },
      env,
    });
  } catch (error) {
    throw error;
  }
}

exports.downloadUsers = downloadUsers;
exports.createUsers = createUsers;
exports.USERS_FNAME = USERS_FNAME;
