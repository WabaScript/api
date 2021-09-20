const users = require("../../mocks/users.json");
const prisma = require("../../lib/dbInstance");
const { build } = require("../../app");
const { ApiTest } = require("../../utils/tests");

const app = build();

it("should return version", async () => {
  const response = await new ApiTest(app).url("/").call();
  expect(response.statusCode).toBe(200);
  expect(response.json()).toHaveProperty("message");
  expect(response.json()).toHaveProperty("version");
});

it("should display healthcheck status", async () => {
  const response = await new ApiTest(app).url("/healthcheck").call();
  expect(response.statusCode).toBe(200);
  expect(response.json()).toMatchObject({ status: "ok" });
});

describe("aurora initialization", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should be uninitialized", async () => {
    const response = await new ApiTest(app).url("/status").call();
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "uninitialized",
    });
  });

  it("should be initialized", async () => {
    await prisma.user.createMany({ data: users });
    const response = await new ApiTest(app).url("/status").call();
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "initialized",
    });
  });
});
