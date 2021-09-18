const { percentage } = require("../../utils/math");

const {
  getWebsiteViewsByBrowser,
  getWebsiteViewsByCountry,
  getWebsiteViewsByOs,
  getWebsiteViewsByPage,
  getWebsiteViewsByReferrer,
  getWebsiteBySeed,
  getWebsiteRealtimeVisitors,
  getWebsitePerformance,
  getWebsiteViewsBySeries,
} = require("../../lib/db");

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

const metrics = (fastify, _opts, done) => {
  fastify.addHook("onRequest", async (request, reply) => {
    const { seed } = request.params;

    try {
      const website = await getWebsiteBySeed(seed);

      if (website.get("shared") === true) {
        return true;
      }
    } catch (err) {
      return reply.code(404).send({ message: "Not found." });
    }

    try {
      await request.jwtVerify();
    } catch (exception) {
      return reply.code(401).send({ message: "Unauthorized." });
    }
  });

  // TODO: removing seed from params and add it to queryString?
  fastify.get("/views/browser", metricsOpts, async (request) => {
    const { seed, range } = request.query;
    const rows = await getWebsiteViewsByBrowser(seed, range);

    return format(rows);
  });

  // http://analytics.renatopozzi.me/v2/metrics/views/browsers?seed=DI3F2JDSKAK&range=7

  fastify.get("/views/country", metricsOpts, async (request, _) => {
    const { seed, range } = request.query;
    const rows = await getWebsiteViewsByCountry(seed, range);

    return format(rows);
  });

  fastify.get("/views/os", metricsOpts, async (request, _) => {
    const { seed, range } = request.query;
    const rows = await getWebsiteViewsByOs(seed, range);

    return format(rows);
  });

  fastify.get("/views/page", metricsOpts, async (request, _) => {
    const { seed, range } = request.query;
    const rows = await getWebsiteViewsByPage(seed, range);

    return format(rows);
  });

  fastify.get("/views/referrer", metricsOpts, async (request, _) => {
    const { seed, range } = request.query;
    const rows = await getWebsiteViewsByReferrer(seed, range);

    return format(rows);
  });

  fastify.get("/views/series", metricsOpts, async (request, _) => {
    const { seed, range } = request.query;

    let factor;

    switch (range) {
      case "day":
        factor = "hour";
        break;
      case "year":
        factor = "month";
        break;
      case "month":
        factor = "day";
        break;
      case "week":
        factor = "day";
        break;
      default:
        throw new Error("Not a valid option..");
    }

    const data = await getWebsiteViewsBySeries(seed, range, factor);

    const labels = data.rows.map((el) => el.range);
    const values = data.rows.map((el) => el.views);

    return {
      labels: labels,
      series: [
        {
          name: "visits",
          data: values,
        },
      ],
    };
  });

  fastify.get("/performance", metricsOpts, async (request, _) => {
    const { seed, range } = request.query;

    const data = await getWebsitePerformance(seed, range);

    const perf = data.rows.reduce((acc, el) => el, {});

    return {
      pageViews: {
        cp: perf.cp_views,
      },
      uniqueVisitors: {
        cp: perf.cp_unique,
      },
      bounceRate: {
        cp: perf.cp_bounces,
      },
      visitDuration: {
        cp: Math.round(perf.cp_visit_duration / 1000),
      },
    };
  });

  fastify.get("/realtime/visitors", async (request, _) => {
    const { seed } = request.query;
    const rows = await getWebsiteRealtimeVisitors(seed);

    return rows.reduce((_acc, el) => el, {});
  });

  fastify.get("/", async (request, _) => {
    const { seed } = request.query;
    const website = await getWebsiteBySeed(seed);

    return { name: website.get("name"), url: website.get("url") };
  });

  done();
};

const format = (rows) => {
  const totalViews = rows.reduce((acc, el) => acc + Number(el.views), 0);

  return rows.map((el) => {
    const perc = percentage(el.views, totalViews);

    return {
      element: el.element,
      views: Number(el.views),
      unique: Number(el.unique),
      percentage: perc,
    };
  });
};

module.exports = { metrics };
