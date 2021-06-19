const collectOpts = {
  schema: {
    body: {
      type: "object",
      required: ["type", "element", "seed"],
      properties: {
        type: { type: "string" },
        element: { type: "string" },
        seed: { type: "string" },
        language: { type: "string" },
      },
    },
  },
};

module.exports = { collectOpts };
