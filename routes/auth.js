const { User } = require("../lib/models/User");
const { verify } = require("../utils/hash");
const { AUTH_COOKIE, AUTH_COOKIE_LIFETIME } = require("../utils/constants");

const attempt = async ({ email, password }) => {
  const user = await new User().where("email", email).fetch({ require: false });

  if (user && verify(password, user.get("password"))) {
    return {
      id: user.get("id"),
      email: user.get("email"),
      firstname: user.get("firstname"),
      lastname: user.get("lastname"),
      created_at: user.get("created_at"),
      updated_at: user.get("updated_at"),
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
      const accessToken = await reply.jwtSign({ data: user });

      reply
        .setCookie(AUTH_COOKIE, accessToken, {
          // domain: "your.domain",
          path: "/",
          secure: false,
          httpOnly: true,
          sameSite: true,
          maxAge: AUTH_COOKIE_LIFETIME,
        })
        .status(200)
        .send({ access_token: accessToken });
    }

    // Set unauthorized.
    return reply.status(401).send({ message: "Unauthorized" });
  });

  fastify.post("/logout", async (_, reply) => {
    reply
      .setCookie(AUTH_COOKIE, null, {
        // domain: "your.domain",
        path: "/",
        secure: false,
        httpOnly: true,
        sameSite: true,
        maxAge: -1,
      })
      .status(200)
      .send({ message: "Logout succeded." });
  });

  done();
};

module.exports = { auth };
