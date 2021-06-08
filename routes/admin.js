const { Website } = require("../lib/models/Website");
const { User } = require("../lib/models/User");
const { Browser } = require("../lib/models/Browser");

const admin = (fastify, _, done) => {
  fastify.get("/websites", async () => {
    return await new Website().fetchAll({ withRelated: ["user"] });
  });

  fastify.get("/users", async () => {
    return await new User().fetchAll();
  });

  fastify.get("/browsers", async () => {
    return await new Browser().fetchAll();
  });

  done();
};

module.exports = { admin };
