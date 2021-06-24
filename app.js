require("dotenv").config();

const fastify = require("fastify");
const jwt = require("fastify-jwt");
const cors = require("fastify-cors");
const static = require("fastify-static");
const cookie = require("fastify-cookie");
const path = require("path");
const R = require("ramda");

const { debug } = require("./routes/debug");
const { admin } = require("./routes/admin");
const { auth } = require("./routes/auth");
const { me } = require("./routes/me");
const { websites } = require("./routes/me/websites");
const { collect } = require("./routes/collect");
const { metrics } = require("./routes/metrics");
const { initialize } = require("./routes/initialize");
const { AUTH_COOKIE } = require("./utils/constants");

const build = (opts = {}) => {
  const app = fastify(opts);

  app.register(cors, {
    origin: true,
    credentials: true,
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: AUTH_COOKIE,
      // signed: true,
    },
  });

  app.register(static, {
    root: path.join(__dirname, "public"),
    prefix: "/public/",
  });

  // is this correct?
  app.addHook("preValidation", async (request, _reply) => {
    if (request.body !== null) {
      request.body = R.reject(R.equals(null))(request.body);
      request.body = R.reject(R.equals(""))(request.body);
    }
  });

  app.register(cookie);

  app.register(debug);
  app.register(initialize, { prefix: "/v2" });
  app.register(admin, { prefix: "/v2" });
  app.register(collect, { prefix: "/v2" });
  app.register(me, { prefix: "/v2/me" });
  app.register(metrics, { prefix: "/v2/metrics" });
  app.register(websites, { prefix: "/v2/me" });
  app.register(auth, { prefix: "/v2/auth" });

  return app;
};

module.exports = { build };
