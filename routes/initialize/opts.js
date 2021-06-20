const initializeUserOpts = {
  schema: {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 8 },
      },
    },
  },
};

module.exports = { initializeUserOpts };
