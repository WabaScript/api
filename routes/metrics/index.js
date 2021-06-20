const { dbInstance } = require("../../lib/dbInstance");
const { percentage } = require("../../utils/math");
const { metricsOpts } = require("./opts");

const metrics = (fastify, _, done) => {
  fastify.addHook("onRequest", async (request, reply) => {
    const { seed } = request.params;

    const website = await dbInstance
      .knex("websites")
      .where("seed", seed)
      .first();

    if (!website) {
      return reply.code(404).send({ message: "Not found." });
    }

    if (website.shared === true) {
      return true;
    }

    try {
      await request.jwtVerify();
    } catch (exception) {
      return reply.code(401).send({ message: "Unauthorized." });
    }
  });

  fastify.get("/:seed/views/browser", metricsOpts, getViewsByBrowser);
  fastify.get("/:seed/views/country", metricsOpts, getViewsByCountry);
  fastify.get("/:seed/views/os", metricsOpts, getViewsByOs);
  fastify.get("/:seed/views/page", metricsOpts, getViewsByPage);
  fastify.get("/:seed/views/referrer", metricsOpts, getViewsByReferrer);

  done();
};

const getViewsByBrowser = async (request, _reply) => {
  const { range } = request.query;
  const { seed } = request.params;

  const rows = await dbInstance
    .knex("events")
    .select("browsers.name as element")
    .count("events.id as views")
    .countDistinct("events.hash as unique")
    .join("browsers", "events.browser_id", "browsers.id")
    .join("websites", "events.website_id", "websites.id")
    .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
    .where("events.type", "pageView")
    .where("websites.seed", seed)
    .groupBy("browsers.name")
    .orderBy("views", "desc")
    .limit(8);

  return format(rows);
};

const getViewsByCountry = async (request, _reply) => {
  const { range } = request.query;
  const { seed } = request.params;

  const rows = await dbInstance
    .knex("events")
    .select("locales.location as element")
    .count("element as views")
    .countDistinct("hash as unique")
    .join("locales", "events.locale_id", "locales.id")
    .join("websites", "events.website_id", "websites.id")
    .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
    .where("events.type", "pageView")
    .where("websites.seed", seed)
    .groupBy("locales.location")
    .orderBy("views", "desc")
    .limit(8);

  return format(rows);
};

const getViewsByOs = async (request, _reply) => {
  const { range } = request.query;
  const { seed } = request.params;

  const rows = await dbInstance
    .knex("events")
    .select("oses.name as element")
    .count("events.id as views")
    .countDistinct("events.hash as unique")
    .join("oses", "events.os_id", "oses.id")
    .join("websites", "events.website_id", "websites.id")
    .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
    .where("events.type", "pageView")
    .where("websites.seed", seed)
    .groupBy("oses.name")
    .orderBy("views", "desc")
    .limit(8);

  return format(rows);
};

const getViewsByPage = async (request, _reply) => {
  const { range } = request.query;
  const { seed } = request.params;

  const rows = await dbInstance
    .knex("events")
    .select("element")
    .count("events.id as views")
    .countDistinct("hash as unique")
    .join("websites", "events.website_id", "websites.id")
    .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
    .where("events.type", "pageView")
    .where("websites.seed", seed)
    .groupBy("element")
    .orderBy("views", "desc")
    .limit(8);

  return format(rows);
};

const getViewsByReferrer = async (request, _reply) => {
  const { range } = request.query;
  const { seed } = request.params;

  const rows = await dbInstance
    .knex("events")
    .select("referrer as element")
    .count("events.id as views")
    .countDistinct("hash as unique")
    .join("websites", "events.website_id", "websites.id")
    .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
    .where("events.type", "pageView")
    .whereNotNull("referrer")
    .where("websites.seed", seed)
    .groupBy("referrer")
    .orderBy("views", "desc")
    .limit(8);

  return format(rows);
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
