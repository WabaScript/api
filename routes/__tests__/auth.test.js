const { build } = require("../../app.js");

let app;

beforeEach(async () => {
  app = await build();
});

afterEach(async () => {
  await app.close();
});

describe("api v2", () => {
  it("does not login", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v2/auth/login",
      payload: {
        email: "thisisbullshit@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Unauthorized",
    });
  });

  it("does login", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v2/auth/login",
      payload: {
        email: "info@renatopozzi.me",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty("access_token");
  });
});
