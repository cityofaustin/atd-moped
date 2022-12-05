const { request } = require("graphql-request");
const { HASURA_AUTH } = require("./secrets");

const getRequestHeaders = (env) => ({
  "X-Hasura-Admin-Secret": HASURA_AUTH.admin_secret[env],
  "content-type": "application/json",
});

const metadataRequest = async ({ env, query }) => {
  const url = `${HASURA_AUTH.endpoint[env]}/v1/metadata`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(query),
    headers: getRequestHeaders(env),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error(text);
    throw text;
  }
  data = await response.json();
  return data;
};

const reloadMetadata = async ({ env }) => {
  // https://hasura.io/docs/latest/api-reference/metadata-api/manage-metadata/#metadata-reload-metadata-syntax
  const query = {
    type: "reload_metadata",
    args: {
      // this resets hasura's tracking of DB triggers - https://github.com/hasura/graphql-engine/issues/8376
      recreate_event_triggers: true,
    },
  };
  const data = await metadataRequest({ env, query });
  return data;
};

const replaceMetadata = async ({ env, metadata }) => {
  // https://hasura.io/docs/latest/api-reference/metadata-api/manage-metadata/#metadata-replace-metadata
  const query = {
    type: "replace_metadata",
    version: 2,
    args: { metadata, allow_inconsistent_metadata: false },
  };
  const data = await metadataRequest({ env, query });
  return data;
};

const exportMetadata = async ({ env }) => {
  const query = {
    type: "export_metadata",
    version: 2,
    args: {},
  };
  const data = await metadataRequest({ env, query });
  return data.metadata;
};

const makeHasuraRequest = ({ query, variables, env }) => {
  const url = `${HASURA_AUTH.endpoint[env]}/v1/graphql`;
  return request({
    url,
    document: query,
    variables,
    requestHeaders: getRequestHeaders(env),
  }).then((data) => data);
};

module.exports = {
  exportMetadata,
  makeHasuraRequest,
  replaceMetadata,
  reloadMetadata,
};
