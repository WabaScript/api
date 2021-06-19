const localeCodes = require("locale-codes");

const tag = (language) => localeCodes.getByTag(language);

module.exports = { tag };
