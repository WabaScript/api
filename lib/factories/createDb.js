const knex = require("knex");
const bookshelf = require("bookshelf");

const dbMaps = {
  pgsql: "pg",
};

const createDb = (dbName, connectionDetails) => {
  const dbDatabase = process.env.DB_CONNECTION;
  const available = ["pgsql"];

  if (available.indexOf(dbDatabase) < 0) {
    throw new Error("Unsupported db istance", dbDatabase);
  }

  const pool = knex({
    client: dbMaps[dbDatabase],
    connection: {
      database: dbName,
      ...connectionDetails,
      charset: "utf8",
    },
  });

  return bookshelf(pool);
};

module.exports = { createDb };
