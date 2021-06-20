const { Website } = require("../../lib/models");
const { storeMeWebsitesOpts, putMeWebsiteOpts } = require("./opts");
const { generate } = require("../../utils/seeds");

const websites = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/websites", getMeWebsites);
  fastify.get("/websites/:seed", getMeWebsite);
  fastify.put("/websites/:seed", putMeWebsiteOpts, putMeWebsite);
  fastify.delete("/websites/:seed", deleteMeWebsite);
  fastify.post("/websites", storeMeWebsitesOpts, postMeWebsites);

  done();
};

const getMeWebsites = async (request, _reply) =>
  new Website().where("user_id", request.user.data.id).fetchAll();

const getMeWebsite = async (request, reply) => {
  const { seed } = request.params;

  const website = await new Website({
    seed: seed,
    user_id: request.user.data.id,
  })
    .fetch()
    .catch((_error) => reply.status(404).send({ message: "Not found" }));

  // Boolean to int
  website.shared = +website.shared;

  return website;
};

const putMeWebsite = async (request, _reply) => {
  const { seed } = request.params;
  const { name, url, shared } = request.body;

  const website = await new Website()
    .where({ seed: seed, user_id: request.user.data.id })
    .save(
      {
        name: name,
        url: url,
        shared: Boolean(Number(shared)),
      },
      { patch: true }
    );

  return { message: "Updated.", data: website };
};

const deleteMeWebsite = async (request, _reply) => {
  const { seed } = request.params;

  await new Website()
    .where("seed", seed)
    .where("user_id", request.user.data.id)
    .destroy();

  return { message: "Deleted" };
};

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
