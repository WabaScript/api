const { User } = require("../../lib/models");
const { putMeOpts } = require("./opts");
const { hash } = require("../../utils/hash");

const me = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", getMe);
  fastify.put("/", putMeOpts, putMe);

  done();
};

const getMe = async (request, _reply) => request.user.data;

const putMe = async (request, _reply) => {
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
};

module.exports = { me };
