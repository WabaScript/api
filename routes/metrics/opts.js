const metricsOpts = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        range: {
          type: "string",
          enum: ["day", "week", "month", "year"],
          default: "day",
        },
      },
    },
  },
};

module.exports = { metricsOpts };
