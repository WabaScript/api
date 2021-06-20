require("dotenv").config();

const fastify = require("fastify");
const jwt = require("fastify-jwt");
const cookie = require("fastify-cookie");
const R = require("ramda");

const { debug } = require("./routes/debug");
const { admin } = require("./routes/admin");
const { auth } = require("./routes/auth");
const { me } = require("./routes/me");
const { websites } = require("./routes/me/websites");
const { collect } = require("./routes/collect");
const { AUTH_COOKIE } = require("./utils/constants");
const { metrics } = require("./routes/metrics");

const build = (opts = {}) => {
  const app = fastify(opts);

  app.register(jwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: AUTH_COOKIE,
      // signed: true,
    },
  });

  // is this correct?
  app.addHook("preValidation", async (request, _reply) => {
    if (request.body !== null) {
      request.body = R.reject(R.equals(null))(request.body);
    }
  });

  app.register(cookie);

  app.register(debug);
  app.register(admin, { prefix: "/v2" });
  app.register(collect, { prefix: "/v2" });
  app.register(me, { prefix: "/v2/me" });
  app.register(metrics, { prefix: "/v2/metrics" });
  app.register(websites, { prefix: "/v2/me" });
  app.register(auth, { prefix: "/v2/auth" });

  return app;
};

module.exports = { build };
