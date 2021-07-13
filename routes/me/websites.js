const { Website } = require("../../lib/models");
const { storeMeWebsitesOpts, putMeWebsiteOpts } = require("./opts");
const { generate } = require("../../utils/seeds");
const {
  getUserWebsites,
  getUserWebsite,
  updateUserWebsite,
  deleteUserWebsite,
  createUserWebsite,
} = require("../../lib/db");

const websites = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/websites", async (request, _) => {
    return await getUserWebsites(request.user.data.id);
  });

  fastify.get("/websites/:seed", async (request, reply) => {
    const { seed } = request.params;

    try {
      const website = await getUserWebsite(request.user.data.id, seed);
    } catch (err) {
      return reply.status(404).send({ message: "Not found" });
    }

    website.shared = +website.shared;

    return website;
  });

  fastify.put("/websites/:seed", putMeWebsiteOpts, async (request, _) => {
    const { seed } = request.params;
    const website = await updateUserWebsite(request.user.data.id, seed, {
      ...request.body,
    });

    return { message: "Updated.", data: website };
  });

  fastify.delete("/websites/:seed", async (request, _) => {
    const { seed } = request.params;
    await deleteUserWebsite(request.user.data.id, seed);
    return { message: "Deleted" };
  });

  fastify.post("/websites", storeMeWebsitesOpts, async (request, _) => {
    const seed = generate();

    return await createUserWebsite(request.user.data.id, {
      seed,
      ...request.body,
    });
  });

  done();
};

module.exports = { websites };
