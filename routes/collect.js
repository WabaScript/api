// XXX TODO: FINIRE TO MADDAAAAAA

const crypto = require("crypto");
const requestIp = require("request-ip");
const localeCodes = require("locale-codes");
const UAParser = require("ua-parser-js");
const mapValuesDeep = require("deepdash/mapValuesDeep");

const { Os } = require("../lib/models/Os");
const { Event } = require("../lib/models/Event");
const { Engine } = require("../lib/models/Engine");
const { Device } = require("../lib/models/Device");
const { Locale } = require("../lib/models/Locale");
const { Browser } = require("../lib/models/Browser");
const { Website } = require("../lib/models/Website");

const fetchOrCreate = async (instance, payload) => {
  const fetched = await instance.where(payload).fetch({ require: false });

  if (fetched) {
    return fetched;
  }

  return await new instance(payload).save();
};

const collect = (fastify, opts, done) => {
  fastify.post("/collect", async (request, reply) => {
    const uaResults = new UAParser(request.headers["user-agent"]).getResult();
    const ua = mapValuesDeep({ ...uaResults }, (v) => (v ? v : "#ND"), {});

    const { type, element, locale: _locale, seed, referrer } = request.body;

    if (!seed) {
      return { message: "Seed is not defined.." };
    }

    // Get Website by seed
    const website = await Website.where("seed", seed).fetch();

    if (!website) {
      return { message: "Aurora ID not defined.." };
    }

    const clientIp = requestIp.getClientIp(request);

    const eventHash = "dddd"; // TODO: Get fingerprint

    // Browser
    const browser = await fetchOrCreate(Browser, {
      name: ua.browser.name,
      version: ua.browser.version,
      major: ua.browser.major,
    });

    // Engine
    const engine = await fetchOrCreate(Engine, {
      name: ua.engine.name,
      version: ua.engine.version,
    });

    // Os
    const os = await fetchOrCreate(Os, {
      name: ua.os.name,
      version: ua.os.version,
    });

    // Create Device
    const device = await fetchOrCreate(Device, {
      vendor: ua.device.vendor,
      model: ua.device.model,
      type: ua.device.type,
    });

    // Locale
    const localeData = localeCodes.getByTag(_locale);
    const locale = await fetchOrCreate(Locale, {
      name: localeData.name,
      local: localeData.local,
      location: localeData.location,
      tag: localeData.tag,
    });

    // Create Event
    const event = await new Event({
      type: type,
      element: element,
      referrer: referrer || null,
      hash: eventHash,
      website_id: website.id,
      browser_id: browser.id,
      engine_id: engine.id,
      os_id: os.id,
      device_id: device.id,
      locale_id: locale.id,
    }).save();

    return {
      message: "Request successful.",
      id: event.id,
    };
  });

  fastify.post("/collect/:id", async (request, reply) => {
    const { id } = request.query;
    const { duration, seed } = JSON.parse(request.body); // Send Beacon Require Parsing

    // Get Website by seed
    const website = await Website.where("seed", seed).fetch();

    if (!website) {
      return reply.status(422);
    }

    try {
      await new Event()
        .where({ id: id, website_id: website.id })
        .save({ duration: duration }, { patch: true });
    } catch (err) {
      console.log("Impossible to log duration.");
    }

    return reply.status(200);
  });

  done();
};

module.exports = { collect };
