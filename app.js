require("dotenv").config();

const fastify = require("fastify");
const { debug } = require("./routes/debug.js");
const { admin } = require("./routes/admin.js");

const build = (opts = {}) => {
  const app = fastify(opts);

  app.register(debug);
  app.register(admin, { prefix: "/v2" });
  // app.register(debug, { prefix: "/" });

  return app;
};

module.exports = { build };
