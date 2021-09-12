const { format } = require("../../utils/response");
const {
  getUserWebsites,
  getUserWebsite,
  createWebsite,
  updateUserWebsite,
  deleteUserWebsite,
} = require("../../lib/db");

const opts = {
  schema: {
    body: {
      type: "object",
      required: ["url", "name", "shared"],
      properties: {
        url: { type: "string" },
        name: { type: "string" },
        shared: { type: "boolean" },
      },
    },
  },
};

const websites = (fastify, _opts, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/websites", async (request) => {
    const uid = request.user.data.id;
    const websites = await getUserWebsites(uid);
    return format(websites);
  });

  fastify.get("/websites/:wid", async (request) => {
    const uid = request.user.data.id;
    const wid = request.params.wid;
    const website = await getUserWebsite(uid, wid);
    return format(website);
  });

  fastify.put("/websites/:wid", opts, async (request) => {
    const uid = request.user.data.id;
    const wid = request.params.wid;
    const website = await updateUserWebsite(uid, wid, request.body);
    return format(website, { message: "Website updated." });
  });

  fastify.delete("/websites/:wid", async (request) => {
    const uid = request.user.data.id;
    const wid = request.params.wid;
    await deleteUserWebsite(uid, wid);
    return format(null, { message: "Website deleted." });
  });

  fastify.post("/websites", opts, async (request) => {
    const uid = request.user.data.id;
    const website = await createWebsite([...Object.values(request.body), uid]);
    return format(website, { message: "Website created." });
  });

  done();
};

module.exports = { websites };
