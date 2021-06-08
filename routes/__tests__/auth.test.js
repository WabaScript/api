const { build } = require("../../app.js");
const { dbInstance } = require("../../lib/dbInstance");

afterAll(async () => await dbInstance.knex.destroy());

describe("login", () => {
  it("does not login", async () => {
    const app = await build();
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
    const app = await build();
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

describe("logout", () => {
  it("does logout", async () => {
    const app = await build();
    const response = await app.inject({
      method: "POST",
      url: "/v2/auth/logout",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"][0]).not.toBeNull();
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Logout succeded.",
    });
  });
});
