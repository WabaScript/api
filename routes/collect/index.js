const { Os } = require("../../lib/models/Os");
const { Event } = require("../../lib/models/Event");
const { Engine } = require("../../lib/models/Engine");
const { Device } = require("../../lib/models/Device");
const { Locale } = require("../../lib/models/Locale");
const { Browser } = require("../../lib/models/Browser");
const { Website } = require("../../lib/models/Website");

const { fetchOrCreate } = require("../../utils/query");
const { parse } = require("../../utils/ua");
const { tag } = require("../../utils/locale");
const { collectOpts, collectIdOpts } = require("./opts");

const collect = (fastify, _opts, done) => {
  fastify.post("/collect", collectOpts, collectEvent);
  fastify.post("/collect/:id", collectIdOpts, updateEvent);

  done();
};

const collectEvent = async (request, reply) => {
  const { type, element, language, seed, referrer } = request.body;

  const website = await Website.where("seed", seed).fetch({ require: false });

  if (!website) {
    return reply.code(400).send({ message: "Aurora ID not defined.." });
  }

  const eventHash = "dddd"; // TODO: Get
  const ua = parse(request.headers["user-agent"]);
  const locale = tag(language);

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
  const loc = await fetchOrCreate(Locale, {
    name: locale.name,
    local: locale.local,
    location: locale.location,
    tag: locale.tag,
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
    locale_id: loc.id,
  }).save();

  return {
    message: "Request successful.",
    id: event.id,
  };
};

const updateEvent = async (request, reply) => {
  const { id } = request.query;
  const { duration, seed } = JSON.parse(request.body); // Send Beacon Require Parsing

  // Get Website by seed
  const website = await Website.where("seed", seed).fetch();

  if (!website) {
    return reply.code(400).send({ message: "Aurora ID not defined.." });
  }

  try {
    await new Event()
      .where({ id: id, website_id: website.id })
      .save({ duration: duration }, { patch: true });
  } catch (err) {
    console.log("Impossible to log duration.");
  }

  return reply.status(200);
};

module.exports = { collect };
