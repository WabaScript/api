const { dbInstance } = require("../../lib/dbInstance");
const { Website } = require("../../lib/models");
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
  fastify.get("/:seed/views/series", metricsOpts, getViewsBySeries);
  fastify.get("/:seed/performance", metricsOpts, getPerformance);
  fastify.get("/:seed/realtime/visitors", getRealtimeVisitors);
  fastify.get("/:seed", getInformations);

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

const getViewsBySeries = async (request, _reply) => {
  const { range } = request.query;
  const { seed } = request.params;

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

  const data = await dbInstance.knex.raw(`
    SELECT
      range.generate_series as range,
      SUM(
        COALESCE(e.views, 0)
      ) AS views
    FROM
      (
        SELECT
          generate_series(
            date_trunc('${range}', now()),
            date_trunc('${range}', now()) + '1 ${range}' :: interval - '1 ${factor}' :: interval,
            '1 ${factor}' :: interval
          ):: timestamptz
      ) as range
      LEFT JOIN (
        SELECT
          events.created_at AS day,
          COUNT(events.id) AS views
        FROM
          events
          JOIN websites on websites.id = events.website_id
        WHERE
          websites.seed = '${seed}'
        AND
          events.type = 'pageView'
        GROUP BY
          day
      ) AS e ON range.generate_series = date_trunc('${factor}', e.day)
    GROUP BY
      range
    ORDER BY
      range
  `);

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
};

const getPerformance = async (request, _reply) => {
  const { range } = request.query;
  const { seed } = request.params;

  const data = await dbInstance.knex.raw(`
    SELECT
      COUNT(events.created_at) as cp_views,
      COUNT(DISTINCT events.hash) as cp_unique,
      AVG(events.duration) as cp_visit_duration,
      (
        select
          COALESCE(sum(t.c), 0)
        from
          (
            select
              count(events.id) as c
            from
              events
            JOIN websites ON events.website_id = websites.id
            WHERE
              events.created_at >= DATE_TRUNC('${range}', now())
              AND websites.seed = '${seed}'
              AND events.type = 'pageView'
            group by
              hash
            having
              count(events.id) = 1
          ) as t
      ) as cp_bounces
    FROM
      events
      JOIN websites ON events.website_id = websites.id
    WHERE
      events.created_at >= DATE_TRUNC('${range}', now())
      AND websites.seed = '${seed}'
      AND events.type = 'pageView'
  `);

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
};

const getRealtimeVisitors = async (request, _reply) => {
  const { seed } = request.params;

  const rows = await dbInstance
    .knex("events")
    .countDistinct("events.hash as visitors")
    .join("websites", "events.website_id", "websites.id")
    .whereRaw(`events.created_at >= (now() - '30 second' :: interval)`)
    .where("events.type", "pageView")
    .where("websites.seed", seed);

  return await rows.reduce((acc, el) => el, {});
};

const getInformations = async (request, _reply) => {
  const { seed } = request.params;

  const website = await new Website({
    seed: seed,
  }).fetch();

  return { name: website.get("name"), url: website.get("url") };
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
