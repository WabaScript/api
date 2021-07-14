const { putMeOpts } = require("./opts");
const { getUserByEmail, updateUser } = require("../../lib/db");

const me = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", async (request, _) => {
    return request.user.data;
    // return await getUserByEmail(request.user.data.email);
  });

  fastify.put("/", putMeOpts, async (request, _) => {
    const user = request.user.data;
    await updateUser(user.id, { ...request.body });
    return { message: "User info updated." };
  });

  done();
};

module.exports = { me };
