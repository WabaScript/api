const users = require("../../mocks/users.json");
const prisma = require("../../lib/dbInstance");
const { apiCall } = require("../../utils/tests");

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

describe("aurora initialization", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should be uninitialized", async () => {
    const response = await apiCall("GET", "/status");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      status: "uninitialized",
    });
  });

  it("should be initialized", async () => {
    await prisma.user.createMany({ data: users });
    const response = await apiCall("GET", "/status");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      status: "initialized",
    });
  });
});
