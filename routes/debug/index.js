const pkg = require("../../package.json");
const { isInitialized } = require("../../utils/app");

const debug = (fastify, _opts, done) => {
  fastify.get("/", getHomepage);
  fastify.get("/healthcheck", getHealthcheck);
  fastify.get("/status", getStatus);

  done();
};

const getHomepage = async (_request, _reply) => ({
  message: "Aurora Analytics API Service",
  version: pkg.version,
});

const getHealthcheck = async (_request, _reply) => ({
  status: "ok",
});

const getStatus = async (_request, _reply) => {
  if (await isInitialized()) {
    return { status: "initialized" };
  }

  return { status: "uninitialized" };
};

module.exports = { debug };
