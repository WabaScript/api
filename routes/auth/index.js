const { verify } = require("../../utils/hash");
const { getUserByEmail } = require("../../lib/db");
const { AUTH_COOKIE, AUTH_COOKIE_LIFETIME } = require("../../utils/constants");

const cookieConf = {
  // domain: "your.domain",
  path: "/",
  secure: false,
  httpOnly: true,
  sameSite: true,
  maxAge: AUTH_COOKIE_LIFETIME,
};

const auth = (fastify, _opts, done) => {
  fastify.post("/login", async (request, reply) => {
    const user = await login({ ...request.body });

    if (user) {
      const accessToken = await reply.jwtSign({ data: user });
      const responseType = process.env.AUTH_MODE || "jwt";

      return reply
        .setCookie(AUTH_COOKIE, accessToken, cookieConf)
        .status(200)
        .send({ response_type: responseType, access_token: accessToken });
    }

    return reply.status(401).send({ message: "Unauthorized" });
  });

  fastify.post("/logout", (_, reply) => {
    reply
      .setCookie(AUTH_COOKIE, null, {
        ...cookieConf,
        maxAge: -1,
      })
      .status(200)
      .send({ message: "Logout succeded." });
  });

  done();
};

const login = async ({ email, password }) => {
  const user = await getUserByEmail(email);

  if (user && verify(password, user.password)) {
    const { password, ...rest } = user;
    return { ...rest };
  }

  return false;
};

module.exports = { auth };
