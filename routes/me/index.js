const { putMeOpts } = require("./opts");
const { getUser, updateUser } = require("../../lib/db");
const { format } = require("../../utils/response");

const me = (fastify, _opts, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", async (request) => {
    const uid = request.user.data.id;
    const user = await getUser(uid);
    return format(user);
  });

  fastify.put("/", putMeOpts, async (request, _) => {
    const uid = request.user.data.id;
    const { password, ...rest } = request.body;
    const user = await updateUser(uid, Object.values({ ...rest }), password);
    return format(user, { message: "User informations updated." });
  });

  done();
};

module.exports = { me };
