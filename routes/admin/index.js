const { Website } = require("../../lib/models");
const { User } = require("../../lib/models");
const { Browser } = require("../../lib/models");

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
