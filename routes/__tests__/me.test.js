const users = require("../../mocks/users.json");
const prisma = require("../../lib/dbInstance");
const { apiCall, doLogin } = require("../../utils/tests");
const { getUserByEmail } = require("../../lib/db");
const { verify } = require("../../utils/hash");

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.user.createMany({ data: users });
});

describe("GET /me", () => {
  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/me");
    expect(response.statusCode).toBe(401);
  });

  it.each(users)("should return the user data for $email", async (user) => {
    const { accessToken } = await doLogin(user.email, "password");
    const response = await apiCall("GET", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({ data: user });
  });
});

describe("PUT /me", () => {
  let accessToken;

  const data = {
    firstname: "Wren",
    lastname: "Bilbee",
    email: "rtroman0@hatena.ne.jp",
    password: "MUEkOBgo3W",
  };

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.user.createMany({ data: users });

    ({ accessToken } = await doLogin("rtroman0@hatena.ne.jp", "password"));
  });

  it("should return 401", async () => {
    const response = await apiCall("PUT", "/v2/me", {});
    expect(response.statusCode).toBe(401);
  });

  it("should update user data and password", async () => {
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: data,
    });

    const user = await getUserByEmail(data.email);

    expect(response.statusCode).toBe(200);
    expect(typeof user).toBe("object");
    expect(user.firstname).toBe(data.firstname);
    expect(user.lastname).toBe(data.lastname);
    expect(user.email).toBe(data.email);
    expect(verify(data.password, user.password)).toBe(true);
  });

  it("should update user data but not the password", async () => {
    const { password, ...rest } = data;
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: rest,
    });

    const user = await getUserByEmail(data.email);

    expect(response.statusCode).toBe(200);
    expect(typeof user).toBe("object");
    expect(user.firstname).toBe(data.firstname);
    expect(user.lastname).toBe(data.lastname);
    expect(user.email).toBe(data.email);
    expect(verify(data.password, user.password)).toBe(false);
    expect(verify("password", user.password)).toBe(true);
  });

  it("should returns 400 because firstname is required", async () => {
    const { firstname, ...rest } = data;
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: rest,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should returns 400 because lastname is required", async () => {
    const { lastname, ...rest } = data;
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: rest,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should returns 400 because email is required", async () => {
    const { email, ...rest } = data;
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: rest,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should returns 400 because email is incorrectly formatted", async () => {
    const { email, ...rest } = data;
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: { ...rest, email: "thisisnotanemail" },
    });

    expect(response.statusCode).toBe(400);
  });
});
