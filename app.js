require("dotenv").config();

const fastify = require("fastify");
const { debug } = require("./routes/debug.js");
const { admin } = require("./routes/admin.js");
const { auth } = require("./routes/auth.js");

const build = (opts = {}) => {
  const app = fastify(opts);

  app.register(debug);
  app.register(admin, { prefix: "/v2" });
  app.register(auth, { prefix: "/v2/auth" });
  // app.register(debug, { prefix: "/" });

  return app;
};

module.exports = { build };
