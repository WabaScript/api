const db = require("../../lib/db");
const prisma = require("../../lib/dbInstance");
const users = require("../../mocks/users.json");
const { build } = require("../../app");
const { ApiTest, AuthTest } = require("../../utils/tests");

// Question: there will be a refresh?
beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.user.createMany({ data: users });
});

const app = build();

const data = {
  name: "Renato Pozzi",
  url: "www.renatopozzi.me",
  is_public: true,
};

describe("POST /me/websites", () => {
  beforeEach(async () => prisma.website.deleteMany());

  it(`should return 401 because authentication is required`, async () => {
    const response = await new ApiTest(app)
      .url("/v2/me/websites")
      .method("post")
      .call();

    expect(response.statusCode).toBe(401);
  });

  it(`should return 400 because name is required`, async () => {
    const { name, ...rest } = data;
    const accessToken = await new AuthTest(app).getToken();
    const response = await new ApiTest(app)
      .url("/v2/me/websites")
      .method("post")
      .payload({ ...rest })
      .headers({ Authorization: `Bearer ${accessToken}` })
      .call();

    expect(response.statusCode).toBe(400);
  });

  it(`should return 400 because url is required`, async () => {
    const { url, ...rest } = data;
    const accessToken = await new AuthTest(app).getToken();
    const response = await new ApiTest(app)
      .url("/v2/me/websites")
      .method("post")
      .payload({ ...rest })
      .headers({ Authorization: `Bearer ${accessToken}` })
      .call();

    expect(response.statusCode).toBe(400);
  });

  it(`should create correctly a website`, async () => {
    const { ...rest } = data;
    const accessToken = await new AuthTest(app).getToken();
    const response = await new ApiTest(app)
      .url("/v2/me/websites")
      .method("post")
      .payload({ ...rest })
      .headers({ Authorization: `Bearer ${accessToken}` })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("data");
    expect(response.json().data).toMatchObject(data);
    expect(response.json().data).toHaveProperty("created_at");
    expect(response.json().data).toHaveProperty("updated_at");
  });

  it(`should set is_public to false by default`, async () => {
    const { is_public, ...rest } = data;
    const accessToken = await new AuthTest(app).getToken();
    const response = await new ApiTest(app)
      .url("/v2/me/websites")
      .method("post")
      .payload({ ...rest })
      .headers({ Authorization: `Bearer ${accessToken}` })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveProperty("is_public", false);
  });
});

describe("GET /me/websites", () => {
  it("should return 401 because authentication is required", async () => {
    const response = await new ApiTest(app)
      .url("/v2/me/websites")
      .method("get")
      .call();

    expect(response.statusCode).toBe(401);
  });

  it("should return all the owner websites", async () => {
    const user = await new AuthTest(app).signIn();
    const response = await new ApiTest(app)
      .url("/v2/me/websites")
      .method("get")
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("data");
    expect(response.json().data).toHaveLength(1);
    // TODO: IDs are not refreshed. Truncate is the solution?
    expect(response.json().data.every((el) => el.user_id === user.id)).toBe(
      true
    );
  });
});

describe("GET /me/websites/:wid", () => {
  const ids = [1, 2, 3];
  it.each(ids)(
    "should return 401 because authentication is required",
    async (id) => {
      const response = await new ApiTest(app)
        .url(`/v2/me/websites/${id}`)
        .method("get")
        .call();

      expect(response.statusCode).toBe(401);
    }
  );

  it.skip("should return 401 because the website is not owned by this user", async () => {
    // TODO: i need to find a way to truncate the db.
  });

  it("should return correctly the owned website", async () => {
    const user = await new AuthTest(app).signIn();
    const { created_at, updated_at, ...website } = (
      await db.getUserWebsites(user.id)
    ).shift();
    const response = await new ApiTest(app)
      .url(`/v2/me/websites/${website.id}`)
      .method("get")
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("data");
    expect(response.json().data).toMatchObject(website);
    expect(response.json().data).toHaveProperty("created_at");
    expect(response.json().data).toHaveProperty("updated_at");
  });
});

describe("PUT /me/websites/:wid", () => {
  const ids = [1, 2, 3];
  it.each(ids)(
    "should return 401 because authentication is required",
    async (id) => {
      const response = await new ApiTest(app)
        .url(`/v2/me/websites/${id}`)
        .method("put")
        .call();

      expect(response.statusCode).toBe(401);
    }
  );

  it(`should return 400 because name is required`, async () => {
    const { name, ...rest } = data;
    const user = await new AuthTest(app).signIn();
    const website = (await db.getUserWebsites(user.id)).shift();
    const response = await new ApiTest(app)
      .url(`/v2/me/websites/${website.id}`)
      .method("put")
      .payload({ ...rest })
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .call();

    expect(response.statusCode).toBe(400);
  });

  it(`should return 400 because url is required`, async () => {
    const { url, ...rest } = data;
    const user = await new AuthTest(app).signIn();
    const website = (await db.getUserWebsites(user.id)).shift();
    const response = await new ApiTest(app)
      .url(`/v2/me/websites/${website.id}`)
      .method("put")
      .payload({ ...rest })
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .call();

    expect(response.statusCode).toBe(400);
  });

  it(`should set is_public to true`, async () => {
    const { is_public, ...rest } = data;
    const user = await new AuthTest(app).signIn();
    const website = (await db.getUserWebsites(user.id)).shift();
    const response = await new ApiTest(app)
      .url(`/v2/me/websites/${website.id}`)
      .method("put")
      .payload({ is_public: true, ...rest })
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveProperty("is_public", true);
  });

  it(`should set name to 'Google Website'`, async () => {
    const { name, ...rest } = data;
    const user = await new AuthTest(app).signIn();
    const website = (await db.getUserWebsites(user.id)).shift();
    const response = await new ApiTest(app)
      .url(`/v2/me/websites/${website.id}`)
      .method("put")
      .payload({ name: "Google Website", ...rest })
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveProperty("name", "Google Website");
  });
});

describe("DELETE /me/websites/:wid", () => {
  const ids = [1, 2, 3];
  it.each(ids)(
    "should return 401 because authentication is required",
    async (id) => {
      const response = await new ApiTest(app)
        .url(`/v2/me/websites/${id}`)
        .method("delete")
        .call();

      expect(response.statusCode).toBe(401);
    }
  );

  it(`should delete correctly the website`, async () => {
    const user = await new AuthTest(app).signIn();
    const website = (await db.getUserWebsites(user.id)).shift();
    const response = await new ApiTest(app)
      .url(`/v2/me/websites/${website.id}`)
      .method("delete")
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("data", null);
  });
});
