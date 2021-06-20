const { dbInstance } = require("../../lib/dbInstance");
const { User } = require("../../lib/models");
const { hash } = require("../../utils/hash");
const { initializeUserOpts } = require("./opts");

const initialize = (fastify, _opts, done) => {
  fastify.post("/initialize/database", initializeDatabase);
  fastify.post("/initialize/user", initializeUserOpts, initializeUser);

  done();
};

const initializeDatabase = async (_request, reply) => {
  try {
    await dbInstance.knex.migrate.latest();
    reply.send({ message: "Database initialized correctly!" });
  } catch (exception) {
    reply.code(500).send({ message: "Error during database migration.." });
  }
};

const initializeUser = async (request, reply) => {
  const { email, password } = request.body;

  const user = new User({
    firstname: "Change",
    lastname: "Me",
    email: email,
    password: hash(password),
  }).save();

  reply.send({ message: "User created correctly!", data: user });
};

module.exports = { initialize };
