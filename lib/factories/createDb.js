const { Pool } = require("pg");

const createDb = (dbName, connectionDetails) => {
  const dbDatabase = process.env.DB_CONNECTION;
  const available = ["pg"];

  /* istanbul ignore next */
  if (available.indexOf(dbDatabase) < 0) {
    throw new Error("Unsupported db istance", dbDatabase);
  }

  const pool = new Pool({
    database: dbName,
    ...connectionDetails,
  });

  return pool;
};

module.exports = { createDb };
