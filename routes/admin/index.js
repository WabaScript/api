const { Website } = require("../../lib/models/Website");
const { User } = require("../../lib/models/User");
const { Browser } = require("../../lib/models/Browser");

const admin = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/websites", getWebsites);
  fastify.get("/users", getUsers);
  fastify.get("/browsers", getBrowsers);

  done();
};

const getWebsites = async (_request, _reply) =>
  new Website().fetchAll({ withRelated: ["user"] });

const getUsers = async (_request, _reply) => new User().fetchAll();

const getBrowsers = async (_request, _reply) => new Browser().fetchAll();

module.exports = { admin };
