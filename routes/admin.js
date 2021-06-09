const { Website } = require("../lib/models/Website");
const { User } = require("../lib/models/User");
const { Browser } = require("../lib/models/Browser");

const admin = (fastify, _, done) => {
  fastify.get("/websites", async () => {
    return new Website().fetchAll({ withRelated: ["user"] });
  });

  fastify.get("/users", async () => {
    return new User().fetchAll();
  });

  fastify.get("/browsers", async () => {
    return new Browser().fetchAll();
  });

  done();
};

module.exports = { admin };
