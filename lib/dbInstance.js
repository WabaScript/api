const { createDb } = require("./factories/createDb");

const dbInstance = createDb(process.env.DB_DATABASE, {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = dbInstance;
