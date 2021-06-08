const knex = require("knex");
const bookshelf = require("bookshelf");

const dbMaps = {
  pgsql: "pg",
};

const createDb = (dbName, connectionDetails) => {
  const dbDatabase = "pgsql"; // FUTURE: Need to insert into env

  const available = ["pgsql"];

  if (available.indexOf(dbDatabase) < 0) {
    throw new Error("Unsupported db istance");
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
