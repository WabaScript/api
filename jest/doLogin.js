const { build } = require("../app");
const { getUserByEmail } = require("../lib/db");

const doLogin = async (email, password) => {
  const app = await build();
  const response = await app.inject({
    method: "POST",
    url: "/v2/auth/login",
    payload: {
      email: email,
      password: password,
    },
  });

  if (response.statusCode === 200) {
    const user = await getUserByEmail(email);

    return {
      accessToken: JSON.parse(response.body).access_token,
      user: user,
    };
  }

  return { accessToken: null, user: null };
};

module.exports = { doLogin };
