const ULID = require("ulid");
const dbInstance = require("./dbInstance");
const { hash } = require("../utils/hash");
// const { Website, Setting, User, Browser } = require("./models");

const firstOrNull = (rows) => (rows.length ? rows[0] : null);

async function getUserWebsites(uid) {
  const params = [uid];
  const { rows } = await dbInstance.query(
    "select * from websites where user_id = $1",
    params
  );

  return rows;
}

async function getUser(uid) {
  const params = [uid];
  const { rows } = await dbInstance.query(
    "select * from users where id = $1",
    params
  );

  return firstOrNull(rows);
}

async function getUserByEmail(email) {
  const params = [email];
  const { rows } = await dbInstance.query(
    "select * from users where email = $1",
    params
  );

  return firstOrNull(rows);
}

async function createUser(data, pw) {
  const hashedPw = hash(pw);
  const params = [...data, hashedPw];
  const { rows } = await dbInstance.query(
    "insert into users (firstname, lastname, email, password) values ($1, $2, $3, $4) returning *",
    params
  );

  return firstOrNull(rows);
}

async function updateUser(uid, data, newPw = null) {
  const params = [...data, hash(newPw), uid];
  const { rows } = await dbInstance.query(
    "update users set firstname = $1, lastname = $2, email = $3, password = COALESCE($4, password) where id = $5 returning *",
    params
  );

  return firstOrNull(rows);
}

async function getWebsite(wid) {
  const params = [wid];
  const { rows } = await dbInstance.query(
    "select * from websites where id = $1",
    params
  );

  return firstOrNull(rows);
}

// TODO: delete seed field. (hint: using an ulid as id?)
async function createWebsite(data) {
  const seed = ULID.ulid();
  const params = [...data, seed];
  const { rows } = await dbInstance.query(
    "insert into websites (name, url, shared, user_id, seed) values ($1, $2, $3, $4, $5) returning *",
    params
  );

  return firstOrNull(rows);
}

async function updateWebsite(wid, data) {
  const params = [...data, wid];
  const { rows } = await dbInstance.query(
    "update websites set name = $1, url = $2, shared = $3 where id = $4 returning *",
    params
  );

  return firstOrNull(rows);
}

// TODO: delete also website events.
async function deleteWebsite(wid) {
  const params = [wid];
  const { rowCount } = await dbInstance.query(
    "delete from websites where id = $1",
    params
  );

  return rowCount;
}

async function getSetting(key) {
  const params = [key];
  const { rows } = await dbInstance.query(
    "select * from settings where key = $1",
    params
  );

  return firstOrNull(rows);
}

async function createSetting(key, value) {
  const params = [key, value];
  const { rows } = await dbInstance.query(
    "insert into settings (key, value) values ($1, $2) returning *",
    params
  );

  return firstOrNull(rows);
}

async function deleteSetting(key) {
  const params = [key];
  const { rowCount } = await dbInstance.query(
    "delete from settings where key = $1",
    params
  );

  return rowCount;
}

module.exports = {
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  getUserWebsites,
  getWebsite,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  getSetting,
  createSetting,
  deleteSetting,
};

// const getWebsiteViewsByBrowser = async (seed, range) => {
//   return dbInstance
//     .knex("events")
//     .select("browsers.name as element")
//     .count("events.id as views")
//     .countDistinct("events.hash as unique")
//     .join("browsers", "events.browser_id", "browsers.id")
//     .join("websites", "events.website_id", "websites.id")
//     .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
//     .where("events.type", "pageView")
//     .where("websites.seed", seed)
//     .groupBy("browsers.name")
//     .orderBy("views", "desc")
//     .limit(8);
// };

// const getWebsiteViewsByCountry = async (seed, range) => {
//   return dbInstance
//     .knex("events")
//     .select("locales.location as element")
//     .count("element as views")
//     .countDistinct("hash as unique")
//     .join("locales", "events.locale_id", "locales.id")
//     .join("websites", "events.website_id", "websites.id")
//     .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
//     .where("events.type", "pageView")
//     .where("websites.seed", seed)
//     .groupBy("locales.location")
//     .orderBy("views", "desc")
//     .limit(8);
// };

// const getWebsiteViewsByOs = async (seed, range) => {
//   return dbInstance
//     .knex("events")
//     .select("oses.name as element")
//     .count("events.id as views")
//     .countDistinct("events.hash as unique")
//     .join("oses", "events.os_id", "oses.id")
//     .join("websites", "events.website_id", "websites.id")
//     .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
//     .where("events.type", "pageView")
//     .where("websites.seed", seed)
//     .groupBy("oses.name")
//     .orderBy("views", "desc")
//     .limit(8);
// };

// const getWebsiteViewsByPage = async (seed, range) => {
//   return dbInstance
//     .knex("events")
//     .select("element")
//     .count("events.id as views")
//     .countDistinct("hash as unique")
//     .join("websites", "events.website_id", "websites.id")
//     .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
//     .where("events.type", "pageView")
//     .where("websites.seed", seed)
//     .groupBy("element")
//     .orderBy("views", "desc")
//     .limit(8);
// };

// const getWebsiteViewsByReferrer = async (seed, range) => {
//   return dbInstance
//     .knex("events")
//     .select("referrer as element")
//     .count("events.id as views")
//     .countDistinct("hash as unique")
//     .join("websites", "events.website_id", "websites.id")
//     .whereRaw(`events.created_at >= DATE_TRUNC('${range}', now())`)
//     .where("events.type", "pageView")
//     .whereNotNull("referrer")
//     .where("websites.seed", seed)
//     .groupBy("referrer")
//     .orderBy("views", "desc")
//     .limit(8);
// };

// const getWebsiteViewsBySeries = async (seed, range, factor) => {
//   return dbInstance.knex.raw(`
//     SELECT
//       range.generate_series as range,
//       SUM(
//         COALESCE(e.views, 0)
//       ) AS views
//     FROM
//       (
//         SELECT
//           generate_series(
//             date_trunc('${range}', now()),
//             date_trunc('${range}', now()) + '1 ${range}' :: interval - '1 ${factor}' :: interval,
//             '1 ${factor}' :: interval
//           ):: timestamptz
//       ) as range
//       LEFT JOIN (
//         SELECT
//           events.created_at AS day,
//           COUNT(events.id) AS views
//         FROM
//           events
//           JOIN websites on websites.id = events.website_id
//         WHERE
//           websites.seed = '${seed}'
//         AND
//           events.type = 'pageView'
//         GROUP BY
//           day
//       ) AS e ON range.generate_series = date_trunc('${factor}', e.day)
//     GROUP BY
//       range
//     ORDER BY
//       range
//   `);
// };

// const getWebsiteRealtimeVisitors = async (seed) => {
//   return dbInstance
//     .knex("events")
//     .countDistinct("events.hash as visitors")
//     .join("websites", "events.website_id", "websites.id")
//     .whereRaw(`events.created_at >= (now() - '30 second' :: interval)`)
//     .where("events.type", "pageView")
//     .where("websites.seed", seed);
// };

// const getWebsitePerformance = async (seed, range) => {
//   return dbInstance.knex.raw(`
//     SELECT
//       COUNT(events.created_at) as cp_views,
//       COUNT(DISTINCT events.hash) as cp_unique,
//       AVG(events.duration) as cp_visit_duration,
//       (
//         select
//           COALESCE(sum(t.c), 0)
//         from
//           (
//             select
//               count(events.id) as c
//             from
//               events
//             JOIN websites ON events.website_id = websites.id
//             WHERE
//               events.created_at >= DATE_TRUNC('${range}', now())
//               AND websites.seed = '${seed}'
//               AND events.type = 'pageView'
//             group by
//               hash
//             having
//               count(events.id) = 1
//           ) as t
//       ) as cp_bounces
//     FROM
//       events
//       JOIN websites ON events.website_id = websites.id
//     WHERE
//       events.created_at >= DATE_TRUNC('${range}', now())
//       AND websites.seed = '${seed}'
//       AND events.type = 'pageView'
//   `);
// };

// module.exports = {
//   getAllBrowsers,
//   getAllUsers,
//   getAllWebsites,
//   getUserByEmail,
//   getUserWebsites,
//   getUserWebsite,
//   createUser,
//   createSetting,
//   createUserWebsite,
//   updateUser,
//   updateUserWebsite,
//   deleteUserWebsite,
//   getWebsiteBySeed,
//   getWebsiteViewsByBrowser,
//   getWebsiteViewsByCountry,
//   getWebsiteViewsByOs,
//   getWebsiteViewsByPage,
//   getWebsiteViewsByReferrer,
//   getWebsiteViewsBySeries,
//   getWebsiteRealtimeVisitors,
//   getWebsitePerformance,
// };
