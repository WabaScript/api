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

const collectIdOpts = {
  schema: {
    body: {
      type: "object",
      required: ["duration", "seed"],
      properties: {
        duration: { type: "number" },
        seed: { type: "string" },
      },
    },
  },
};

module.exports = { collectOpts, collectIdOpts };
