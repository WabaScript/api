const { createUser, createSetting } = require("../../lib/db");
const { dbInstance } = require("../../lib/dbInstance");
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

  const user = await createUser({
    firstname: "Change",
    lastname: "Me",
    email: email,
    password: password,
  });

  const setting = await createSetting({
    key: "APP_INITIALIZED",
    value: "YES",
  });

  reply.send({ message: "User created correctly!", data: { user, setting } });
};

module.exports = { initialize };
