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
  const users = await getUsers("prod");
  if (["local", "test"].includes(env)) {
    users.forEach((user) => (user.user_id = 1));
  }
  saveJsonFile(USERS_FNAME, users);
}

exports.downloadUsers = downloadUsers;
exports.USERS_FNAME = USERS_FNAME;
