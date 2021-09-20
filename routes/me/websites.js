const { format } = require("../../utils/response");
const db = require("../../lib/db");

const opts = {
  schema: {
    body: {
      type: "object",
      required: ["url", "name"],
      properties: {
        url: { type: "string" },
        name: { type: "string" },
        is_public: { type: "boolean" },
      },
    },
  },
};

const websites = (fastify, _opts, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/websites", async (request) => {
    const uid = request.user.data.id;
    const websites = await db.getUserWebsites(uid);
    return format(websites);
  });

  fastify.get("/websites/:wid", async (request) => {
    const uid = request.user.data.id;
    const wid = request.params.wid;
    const website = await db.getUserWebsite(uid, wid);
    return format(website);
  });

  fastify.put("/websites/:wid", opts, async (request, reply) => {
    const uid = request.user.data.id;
    const wid = request.params.wid;
    const website = await db.getUserWebsite(uid, wid);

    if (website.user_id !== uid) {
      return reply.status(401).send({ message: "unauthorized" });
    }

    const updatedWebsite = await db.updateWebsite(wid, request.body);

    return format(updatedWebsite, { message: "Website updated." });
  });

  fastify.delete("/websites/:wid", async (request) => {
    const uid = request.user.data.id;
    const wid = request.params.wid;
    const website = await db.getUserWebsite(uid, wid);

    if (website.user_id !== uid) {
      return reply.status(401).send({ message: "unauthorized" });
    }

    await db.deleteWebsite(wid);
    return format(null, { message: "Website deleted." });
  });

  fastify.post("/websites", opts, async (request) => {
    const uid = request.user.data.id;
    const website = await db.createWebsite({ ...request.body, user_id: uid });
    return format(website, { message: "Website created." });
  });

  done();
};

module.exports = { websites };
