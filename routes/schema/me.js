const updateMeSchema = {
  body: {
    required: ["firstname", "lastname", "email"],
    properties: {
      firstname: { type: "string" },
      lastname: { type: "string" },
      email: { type: "string" },
      password: { type: "string", minLength: 8 },
    },
  },
};

module.exports = { updateMeSchema };
