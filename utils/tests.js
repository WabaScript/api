const { build } = require("../app");
const { getUserByEmail } = require("../lib/db");

const apiCall = async (method, url, payload, headersapiOpts, buildOpts = {}) =>
  build(buildOpts).inject({ method, url, ...apiOpts });

class ApiTest {
  constructor(app) {
    this.data = { method: "get" };
    this.app = app;
  }

  url(url) {
    this.data.url = url;
    return this;
  }

  method(method) {
    this.data.method = method;
    return this;
  }

  payload(payload) {
    this.data.payload = payload;
    return this;
  }

  headers(headers) {
    this.data.headers = { ...headers };
    return this;
  }

  async call() {
    return await this.app.inject({ ...this.data });
  }
}

class AuthTest {
  constructor(app) {
    this.app = app;
  }

  async getToken(email = "firstuser@example.com", password = "password") {
    try {
      const response = await new ApiTest(this.app)
        .url("/v2/auth/login")
        .method("post")
        .payload({ email, password })
        .call();

      return JSON.parse(response.body).access_token;
    } catch (err) {
      return false;
    }
  }

  async signIn(email = "firstuser@example.com", password = "password") {
    try {
      const user = await getUserByEmail(email);
      const accessToken = await this.getToken(email, password);
      return { ...user, accessToken };
    } catch (err) {
      return false;
    }
  }
}

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

module.exports = { apiCall, doLogin, ApiTest, AuthTest };
