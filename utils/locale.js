const localeCodes = require("locale-codes");
const mapValuesDeep = require("deepdash/mapValuesDeep");

const tag = (language) => {
  const parsed = localeCodes.getByTag(language);
  return mapValuesDeep({ ...parsed }, (v) => (v ? v : "#ND"), {});
};

module.exports = { tag };
