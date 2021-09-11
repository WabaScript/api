const dbInstance = require("../../lib/dbInstance");
const { apiCall } = require("../../jest/apiCall");

afterAll(async () => dbInstance.end());

it("should go fine", async () => {
  const response = await apiCall("GET", "/");
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toHaveProperty("message");
  expect(JSON.parse(response.body)).toHaveProperty("version");
});

it("should display healthcheck status", async () => {
  const response = await apiCall("GET", "/healthcheck");
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toMatchObject({ status: "ok" });
});

it("should display status", async () => {
  const response = await apiCall("GET", "/status");
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toMatchObject({ status: "uninitialized" });
});
