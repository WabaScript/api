const pkg = require("../../package.json");
const { getSetting } = require("../../lib/db");

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

  fastify.get("/status", async () => {
    const appInitialized = await getSetting("APP_INITIALIZED");

    if (appInitialized && appInitialized.value === "YES") {
      return { status: "initialized" };
    }

    return { status: "uninitialized" };
  });

  done();
};

module.exports = { debug };
