const { getAllBrowsers, getAllWebsites, getAllUsers } = require("../../lib/db");

const admin = (fastify, _opts, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/websites", async () => {
    const { data } = await getAllWebsites();
    return data;
  });

  fastify.get("/users", async () => {
    return getAllUsers();
  });

  fastify.get("/browsers", async () => {
    return getAllBrowsers();
  });

  done();
};

module.exports = { admin };
