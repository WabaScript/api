const { build } = require("../../app.js");
const { doLogin } = require("../../jest/doLogin.js");
const { refreshDb } = require("../../jest/refreshDb.js");
const { user } = require("../../jest/schema.js");
const { dbInstance } = require("../../lib/dbInstance");

let accessToken = null;

beforeAll(async () => {
  await refreshDb();
  accessToken = await doLogin("info@renatopozzi.me", "password");
});

afterAll(async () => dbInstance.knex.destroy());

describe("GET /me", () => {
  it("should return 401", async () => {
    const app = await build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/me",
    });

    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const app = await build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/me",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject(user);
  });
});

const users = [
  {
    data: {
      firstname: "Giovanni",
    },
    status: 400,
  },
  {
    data: {
      lastname: "Bona",
    },
    status: 400,
  },
  {
    data: {
      email: "info@renatopozzi.me",
    },
    status: 400,
  },
  {
    data: {
      firstname: "Giovanni",
      lastname: "Bona",
    },
    status: 400,
  },
  {
    data: {
      lastname: "Bona",
      email: "info@renatopozzi.me",
    },
    status: 400,
  },
  {
    data: {
      firstname: "Giovanni",
      lastname: "Bona",
      email: "info@renatopozzi.me",
    },
    status: 200,
  },
  {
    data: {
      firstname: "Giovanni",
      lastname: "Bona",
      email: "info@renatopozzi.me",
      password: "",
    },
    status: 400,
  },
  {
    data: {
      firstname: "Giovanni",
      lastname: "Bona",
      email: "info@renatopozzi.me",
      password: "small",
    },
    status: 400,
  },
  {
    data: {
      firstname: "Giovanni",
      lastname: "Bona",
      email: "info@renatopozzi.me",
      password: "thisdodo",
    },
    status: 200,
  },
];

describe.each(users)("PUT /me", (row) => {
  it(`should return ${row.status}`, async () => {
    const app = await build();
    const response = await app.inject({
      method: "PUT",
      url: "/v2/me",
      payload: row.data,
    });

    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const app = await build();
    const response = await app.inject({
      method: "PUT",
      url: "/v2/me",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: row.data,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "User info updated.",
    });
  });
});
