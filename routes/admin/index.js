const { getAllBrowsers, getAllWebsites, getAllUsers } = require("../../lib/db");

const admin = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/websites", async () => {
    return await getAllWebsites();
  });

  fastify.get("/users", async () => {
    return await getAllUsers();
  });

  fastify.get("/browsers", async () => {
    return await getAllBrowsers();
  });

  done();
};

module.exports = { admin };
