const fastify = require("fastify");
const { debug } = require("./routes/debug.js");

const build = (opts = {}) => {
  const app = fastify(opts);

  app.register(debug);
  // app.register(debug, { prefix: "/" });

  return app;
};

module.exports = { build };
