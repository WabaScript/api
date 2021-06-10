const pkg = require("../../package.json");

const debug = (fastify, _opts, done) => {
  fastify.get("/", getHomepage);
  fastify.get("/healthcheck", getHealthcheck);

  done();
};

const getHomepage = async (_request, _reply) => ({
  message: "Aurora Analytics API Service",
  version: pkg.version,
});

const getHealthcheck = async (_request, _reply) => ({
  status: "ok",
});

module.exports = { debug };
