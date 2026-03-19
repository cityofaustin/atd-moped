const { request } = require("graphql-request");

const HASURA_AUTH = {
  endpoint: {
    local: "http://localhost:8082/v1/graphql",
  },
  admin_secret: {
    local: "hasurapassword",
  },
};

function makeHasuraRequest({ query, variables, env = "local" }) {
  const headers = {
    "X-Hasura-Admin-Secret": HASURA_AUTH.admin_secret[env],
    "content-type": "application/json",
  };
  const res = request({
    url: HASURA_AUTH.endpoint[env],
    document: query,
    variables,
    requestHeaders: headers,
  }).then((data) => data);
  return res;
}

module.exports = {
  makeHasuraRequest,
};
