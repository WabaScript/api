const pkg = require("../../package.json");
const prisma = require("../../lib/dbInstance");

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
    const nUsers = await prisma.user.count();
    return nUsers > 0 ? { status: "initialized" } : { status: "uninitialized" };
  });

  done();
};

module.exports = { debug };
