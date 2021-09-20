const { build } = require("../app");

const apiCall = async (method, url, apiOpts, buildOpts = {}) =>
  build(buildOpts).inject({ method, url, ...apiOpts });

module.exports = { apiCall };
