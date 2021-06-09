const { User } = require("../lib/models/User");
const { updateMeSchema } = require("./schema/me");
const { hash } = require("../utils/hash");

const me = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", async (request, _reply) => {
    return request.user.data;
  });

  fastify.put("/", { updateMeSchema }, async (request, _reply) => {
    const user = request.user.data;
    const { firstname, lastname, email, password } = request.body;

    await new User({ id: user.id, email: user.email }).save(
      {
        firstname: firstname,
        lastname: lastname,
        email: email,
        ...(password !== undefined && { password: hash(password) }),
      },
      { patch: true }
    );

    return { message: "User info updated." };
  });

  done();
};

module.exports = { me };
