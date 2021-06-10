const putMeOpts = {
  schema: {
    body: {
      required: ["firstname", "lastname", "email"],
      properties: {
        firstname: { type: "string" },
        lastname: { type: "string" },
        email: { type: "string" },
        password: { type: "string", minLength: 8 },
      },
    },
  },
};

const storeMeWebsitesOpts = {
  schema: {
    body: {
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
