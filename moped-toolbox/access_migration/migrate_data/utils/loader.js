const fs = require("fs");

const loadJsonFile = (name) => {
  let raw = fs.readFileSync(name);
  return JSON.parse(raw);
};

const saveJsonFile = (name, data) => {
  fs.writeFileSync(name, JSON.stringify(data));
};

module.exports = {
  loadJsonFile,
  saveJsonFile,
};
