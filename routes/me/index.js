const { User } = require("../../lib/models/User");
const { Website } = require("../../lib/models/Website");
const { putMeOpts, storeMeWebsitesOpts } = require("./opts");
const { hash } = require("../../utils/hash");
const { generate } = require("../../utils/seeds");

const me = (fastify, _, done) => {
  fastify.addHook("onRequest", (request) => request.jwtVerify());

  fastify.get("/", getMe);
  fastify.put("/", putMeOpts, putMe);
  fastify.get("/websites", getMeWebsites);
  fastify.post("/websites", storeMeWebsitesOpts, postMeWebsites);

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

const getMeWebsites = async (request, _reply) =>
  new Website().where("user_id", request.user.data.id).fetchAll();

const postMeWebsites = async (request, _reply) => {
  const { name, url, shared } = request.body;

  const seed = generate();

  return new Website({
    url: url,
    name: name,
    seed: seed,
    shared: Boolean(Number(shared)),
    user_id: request.user.data.id,
  }).save();
};

module.exports = { me };
