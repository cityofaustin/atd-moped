const { request } = require("graphql-request");

const HASURA = {
  endpoint: {
    local: "http://localhost:8080/v1/graphql",
  },
  admin_secret: {
    local: "DuMmyApiKeyHFVOVto19otC1wX6sP2N0VSKrCD70L10B7Sm525ZR6L672i2F79M9!",
  },
};

function makeHasuraRequest({ query, variables, env = "local" }) {
  const headers = {
    "X-Hasura-Admin-Secret": HASURA.admin_secret[env],
    "content-type": "application/json",
  };
  return request({
    url: HASURA.endpoint[env],
    document: query,
    variables,
    requestHeaders: headers,
  }).then((data) => data);
}

module.exports = {
  makeHasuraRequest,
};
