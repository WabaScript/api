require("dotenv").config();

const fastify = require("fastify");
const jwt = require("fastify-jwt");
const cookie = require("fastify-cookie");

const { debug } = require("./routes/debug");
const { admin } = require("./routes/admin");
const { auth } = require("./routes/auth");
const { me } = require("./routes/me");
const { collect } = require("./routes/collect");
const { AUTH_COOKIE } = require("./utils/constants");

const build = (opts = {}) => {
  const app = fastify(opts);

  app.register(jwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: AUTH_COOKIE,
      // signed: true,
    },
  });

  app.register(cookie);

  app.register(debug);
  app.register(admin, { prefix: "/v2" });
  app.register(collect, { prefix: "/v2" });
  app.register(me, { prefix: "/v2/me" });
  app.register(auth, { prefix: "/v2/auth" });

  return app;
};

module.exports = { build };
