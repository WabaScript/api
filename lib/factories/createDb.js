const knex = require("knex");
const bookshelf = require("bookshelf");

const createDb = (dbName, connectionDetails) => {
  const dbDatabase = process.env.DB_CONNECTION;
  const available = ["pg"];

  if (available.indexOf(dbDatabase) < 0) {
    throw new Error("Unsupported db istance", dbDatabase);
  }

  const pool = knex({
    client: dbDatabase,
    connection: {
      database: dbName,
      ...connectionDetails,
      charset: "utf8",
      ssl:
        process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
  });

  return bookshelf(pool);
};

module.exports = { createDb };
