const { build } = require("../../app.js");

it("home info is going fine", async () => {
  const app = await build();
  const response = await app.inject({
    method: "GET",
    url: "/",
  });

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toHaveProperty("message");
  expect(JSON.parse(response.body)).toHaveProperty("version");
});

it("healthcheck is going fine", async () => {
  const app = await build();
  const response = await app.inject({
    method: "GET",
    url: "/healthcheck",
  });

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toMatchObject({ status: "ok" });
});
