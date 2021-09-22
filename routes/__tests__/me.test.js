const users = require("../../mocks/users.json");
const prisma = require("../../lib/dbInstance");
const db = require("../../lib/db");
const { build } = require("../../app");
const { ApiTest, AuthTest } = require("../../utils/tests");
const { verify } = require("../../utils/hash");

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.user.createMany({ data: users });
});

const app = build();

describe("GET /v2/me", () => {
  it("should return 401 because authentication is required", async () => {
    const response = await new ApiTest(app).url("/v2/me").call();
    expect(response.statusCode).toBe(401);
  });

  it("should return the authenticated user data", async () => {
    const user = await new AuthTest(app).signIn();
    const response = await new ApiTest(app)
      .url("/v2/me")
      .method("get")
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  });
});

describe("PUT /me", () => {
  it("should return 401 because authentication is required", async () => {
    const response = await new ApiTest(app).method("put").url("/v2/me").call();
    expect(response.statusCode).toBe(401);
  });

  it.skip("should update firstname and lastname", async () => {
    const data = { firstname: "Gino", lastname: "Pollo" };
    const authUser = await new AuthTest(app).signIn();
    const response = await new ApiTest(app)
      .url("/v2/me")
      .method("put")
      .payload({ ...data })
      .headers({ Authorization: `Bearer ${authUser.accessToken}` })
      .call();

    const user = await db.getUserByEmail(authUser.email);

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("data");
    expect(response.json()).toHaveProperty("firstname", data.firstname);
    expect(response.json()).toHaveProperty("lastname", data.lastname);
    expect(verify("password", user.password)).toBe(true);
  });

  it.skip("should returns 400 because firstname is required", async () => {});
  it.skip("should returns 400 because lastname is required", async () => {});
  it.skip("should returns 400 because email is required", async () => {});
  it.skip("should returns 400 because email is incorrectly formatted", async () => {});

  // TODO: Not work cuz i need to pass all the data not only PW.
  it.skip("should update user password", async () => {
    const data = { password: "giggiolone" };
    const authUser = await new AuthTest(app).signIn();
    const response = await new ApiTest(app)
      .url("/v2/me")
      .method("put")
      .payload({ ...data })
      .headers({ Authorization: `Bearer ${authUser.accessToken}` })
      .call();

    const user = await db.getUserByEmail(authUser.email);

    expect(response.statusCode).toBe(200);
    expect(verify(data.password, user.password)).toBe(true);
  });
});
