const pkg = require("../../package.json");
const { isInitialized } = require("../../utils/app");

const debug = (fastify, _opts, done) => {
  fastify.get("/", () => {
    return {
      message: "Aurora API Service",
      version: pkg.version,
    };
  });

  fastify.get("/healthcheck", () => {
    return { status: "ok" };
  });

  // TODO: refactor this..
  fastify.get("/status", getStatus);

  done();
};

const getStatus = async (_request, _reply) => {
  if (await isInitialized()) {
    return { status: "initialized" };
  }

  return { status: "uninitialized" };
};

module.exports = { debug };
