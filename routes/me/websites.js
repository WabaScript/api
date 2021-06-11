const { Website } = require("../../lib/models/Website");
const { storeMeWebsitesOpts } = require("./opts");
const { generate } = require("../../utils/seeds");

const websites = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/websites", getMeWebsites);
  fastify.post("/websites", storeMeWebsitesOpts, postMeWebsites);

  done();
};

const getMeWebsites = async (request, _reply) =>
  new Website().where("user_id", request.user.data.id).fetchAll();

const postMeWebsites = async (request, _reply) => {
  const { name, url, shared } = request.body;

  const seed = generate();

  return new Website({
    url: url,
    name: name,
    seed: seed,
    shared: Boolean(Number(shared)),
    user_id: request.user.data.id,
  }).save();
};

module.exports = { websites };
