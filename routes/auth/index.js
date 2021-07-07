const { User } = require("../../lib/models");
const { verify } = require("../../utils/hash");
const { AUTH_COOKIE, AUTH_COOKIE_LIFETIME } = require("../../utils/constants");

const auth = (fastify, _opts, done) => {
  fastify.post("/login", postLogin);
  fastify.post("/logout", postLogout);

  done();
};

const postLogin = async (request, reply) => {
  const { email, password } = request.body;

  const user = await login({ email, password });

  if (user) {
    const accessToken = await reply.jwtSign({ data: user });

    const responseType = process.env.AUTH_MODE || "jwt";

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
      .send({ response_type: responseType, access_token: accessToken });
  }

  // Set unauthorized.
  return reply.status(401).send({ message: "Unauthorized" });
};

const postLogout = async (_request, reply) => {
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
};

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

module.exports = { auth };
