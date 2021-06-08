const { Pool } = require("pg");

const createDb = (dbName, connectionDetails) => {
  const dbDatabase = "pgsql"; // FUTURE: Need to insert into env

  if (dbDatabase === "pgsql") {
    return new Pool({
      database: dbName,
      ...connectionDetails,
    });
  } else {
    throw new Error("Unsupported db istance");
  }
};

module.exports = { createDb };
