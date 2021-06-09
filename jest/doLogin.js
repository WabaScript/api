const { build } = require("../app");

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

  return JSON.parse(response.body).access_token;
};

module.exports = { doLogin };
