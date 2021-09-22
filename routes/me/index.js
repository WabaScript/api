const db = require("../../lib/db");
const { format } = require("../../utils/response");

const opts = {
  schema: {
    body: {
      type: "object",
      required: ["firstname", "lastname", "email"],
      properties: {
        firstname: { type: "string" },
        lastname: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 8 },
      },
    },
  },
};

const me = (fastify, _opts, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", async (request) => {
    const uid = request.user.data.id;
    const user = await db.getUserById(uid);
    return format(user);
  });

  fastify.put("/", opts, async (request, _) => {
    const uid = request.user.data.id;
    const { password, ...rest } = request.body;
    const user = await db.updateUser(uid, { ...rest }, password);
    return format(user, { message: "User informations updated." });
  });

  done();
};

module.exports = { me };
