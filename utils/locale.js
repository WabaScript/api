const localeCodes = require("locale-codes");

const tag = (language) => {
  return localeCodes.getByTag(language);
};

module.exports = { tag };
