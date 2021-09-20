const users = require("../../mocks/users.json");
const prisma = require("../../lib/dbInstance");
const { build } = require("../../app");
const { ApiTest } = require("../../utils/tests");

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.website.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.createMany({ data: users });
});

const app = build();

describe("POST /auth/login", () => {
  it("should not login", async () => {
    const response = await new ApiTest(app)
      .url("/v2/auth/login")
      .method("post")
      .payload({ email: "foo@bar.baz", password: "password" })
      .call();

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      message: "Unauthorized",
    });
  });

  it("should not login", async () => {
    const response = await new ApiTest(app)
      .url("/v2/auth/login")
      .method("post")
      .call();

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      message: "Unauthorized",
    });
  });

  it.each(users)("should login $email", async (user) => {
    const response = await new ApiTest(app)
      .url("/v2/auth/login")
      .method("post")
      .payload({ email: user.email, password: "password" })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("access_token");
    expect(response.json()).toHaveProperty("response_type");
    expect(response.json().response_type).toBe("jwt");
  });
});

describe("logout", () => {
  it("should logout", async () => {
    const response = await new ApiTest(app)
      .url("/v2/auth/logout")
      .method("post")
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"][0]).not.toBeNull();
    expect(response.json()).toMatchObject({
      message: "Logout succeded.",
    });
  });
});
