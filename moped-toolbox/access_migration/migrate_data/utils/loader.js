const fs = require("fs");

const loadJsonFile = (name) => {
  let raw = fs.readFileSync(name);
  return JSON.parse(raw);
};

exports.loadJsonFile = loadJsonFile;
