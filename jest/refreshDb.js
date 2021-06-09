const { dbInstance } = require("../lib/dbInstance");

const refreshDb = async () => {
  await dbInstance.knex.migrate.rollback();
  await dbInstance.knex.migrate.latest();
  await dbInstance.knex.seed.run();
};

module.exports = { refreshDb };
