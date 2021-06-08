const { createDb } = require("./factories/createDb");

const dbInstance = createDb("aurora", {
  user: "root",
  host: "localhost",
  password: "password",
  port: 5432,
});

module.exports = { dbInstance };
