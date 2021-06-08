const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");
const { User } = require("../lib/models/User");
const { verify } = require("../utils/hash");
const { AUTH_COOKIE, AUTH_COOKIE_LIFETIME } = require("../utils/constants");

const makeJwt = ({ data }) =>
  jwt.sign({ data: data }, process.env.JWT_SECRET, {
    expiresIn: AUTH_COOKIE_LIFETIME,
  });

const attempt = async ({ email, password }) => {
  const user = await new User().where("email", email).fetch({ require: false });

  if (user && verify(password, user.get("password"))) {
    return {
      id: user.get("id"),
      email: user.get("email"),
      firstname: user.get("firstname"),
      lastname: user.get("lastname"),
      created_at: user.get("created_at"),
    };
  }

  return false;
};

const login = async ({ email, password }) => {
  const user = await attempt({ email, password });

  if (user) {
    return user;
  }

  return false;
};

const auth = (fastify, _, done) => {
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    const user = await login({ email, password });

    if (user) {
      const accessToken = makeJwt({ data: user });

      const cookie = serialize(AUTH_COOKIE, accessToken, {
        path: "/",
        httpOnly: true,
        sameSite: true,
        maxAge: AUTH_COOKIE_LIFETIME,
      });

      reply.header("Set-Cookie", [cookie]);

      return reply.status(200).send({ access_token: accessToken });
    }

    // Set unauthorized.
    return reply.status(401).send({ message: "Unauthorized" });
  });

  fastify.post("/logout", async (request, reply) => {
    const cookie = serialize(AUTH_COOKIE, null, {
      path: "/",
      httpOnly: true,
      sameSite: true,
      maxAge: -1,
    });

    reply.header("Set-Cookie", [cookie]);

    return reply.status(200).send({ message: "Logout succeded." });
  });

  done();
};

module.exports = { auth };
