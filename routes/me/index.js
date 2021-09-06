const { putMeOpts } = require("./opts");
const { getUser } = require("../../lib/db");

const me = (fastify, _opts, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", async (request, _response) => {
    return getUser(request.user.data.id);
  });

  fastify.put("/", putMeOpts, async (request, _) => {
    const user = request.user.data;
    await updateUser(user.id, { ...request.body });
    return { message: "User info updated." };
  });

  done();
};

module.exports = { me };
