const pkg = require("../package.json");

const debug = (fastify, opts, done) => {
  fastify.get("/", async (request, reply) => ({
    message: "Aurora Analytics API Service",
    version: pkg.version,
  }));

  fastify.get("/healthcheck", async (request, reply) => ({
    status: "ok",
  }));

  done();
};

module.exports = { debug };
