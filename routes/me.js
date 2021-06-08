const { User } = require("../lib/models/User");
const { Browser } = require("../lib/models/Browser");

const me = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", async (request, _) => {
    return request.user.data;
  });

  fastify.put("/", async (request, _) => {
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
