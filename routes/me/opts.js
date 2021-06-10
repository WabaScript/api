const putMeOpts = {
  schema: {
    body: {
      type: "object",
      required: ["firstname", "lastname", "email"],
      properties: {
        firstname: { type: "string" },
        lastname: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 8 },
      },
    },
  },
};

const storeMeWebsitesOpts = {
  schema: {
    body: {
      type: "object",
      required: ["url", "name", "shared"],
      properties: {
        url: { type: "string" },
        name: { type: "string" },
        shared: { type: "boolean" },
      },
    },
  },
};

module.exports = { putMeOpts, storeMeWebsitesOpts };
