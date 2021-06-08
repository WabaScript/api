const { build } = require("../../app.js");

let app;

beforeEach(async () => {
  app = await build();
});

afterEach(async () => {
  await app.close();
});

it("home info is going fine", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/",
  });

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toHaveProperty("message");
  expect(JSON.parse(response.body)).toHaveProperty("version");
});

it("healthcheck is going fine", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/healthcheck",
  });

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toMatchObject({ status: "ok" });
});
