const user = {
  id: expect.any(Number),
  firstname: expect.any(String),
  lastname: expect.any(String),
  email: expect.any(String),
  created_at: expect.any(String),
  updated_at: expect.any(String),
};

const website = {
  id: expect.any(Number),
  name: expect.any(String),
  url: expect.any(String),
  seed: expect.any(String),
  shared: expect.any(Boolean),
  user_id: expect.any(Number),
  created_at: expect.any(String),
  updated_at: expect.any(String),
};

const browser = {
  id: expect.any(Number),
  name: expect.any(String),
  version: expect.any(String),
  major: expect.any(String),
  created_at: expect.any(String),
  updated_at: expect.any(String),
};

module.exports = { user, website, browser };
