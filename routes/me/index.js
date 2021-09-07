const { putMeOpts } = require("./opts");
const { getUser, updateUser } = require("../../lib/db");
const { format } = require("../../utils/response");

// TODO: add tests for new data.
const me = (fastify, _opts, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", async (request) => {
    const uid = request.user.data.id;
    const user = await getUser(uid);
    return format(user);
  });

  fastify.put("/", putMeOpts, async (request, _) => {
    const uid = request.user.data.id;
    const user = await updateUser(uid, Object.values(request.body));
    return format(user, { message: "User informations updated." });
  });

  done();
};

module.exports = { me };
