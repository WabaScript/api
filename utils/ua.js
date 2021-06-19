const UAParser = require("ua-parser-js");
const mapValuesDeep = require("deepdash/mapValuesDeep");

const parse = (ua) => {
  const parsed = new UAParser(ua).getResult();
  return mapValuesDeep({ ...parsed }, (v) => (v ? v : "#ND"), {});
};

module.exports = { parse };
