const db = require("../../lib/db");
const prisma = require("../../lib/dbInstance");
const { parse } = require("../../utils/ua");
const { tag } = require("../../utils/locale");
const { format } = require("../../utils/response");

const opts = {
  schema: {
    body: {
      type: "object",
      required: ["type", "element", "wid"],
      properties: {
        type: { type: "string" },
        element: { type: "string" },
        wid: { type: "string" },
      },
    },
  },
};

const collect = (fastify, _opts, done) => {
  fastify.post("/collect", opts, async (request, reply) => {
    const website = await db.getWebsiteById(request.body.wid);

    if (!website) {
      return reply.code(404).send({ message: "Aurora ID not defined.." });
    }

    const ua = parse(request.headers["user-agent"]);
    const locale = tag(request.body.language);

    const metadata = [];
    for (const index in ua.elements) {
      const element = ua.elements[index];

      let meta = await prisma.metadata.findFirst({
        where: { ...element },
      });

      if (!meta) {
        meta = await prisma.metadata.create({
          data: { ...element },
        });
      }

      metadata.push(meta);
    }

    // Create Event
    const event = await prisma.event.create({
      data: {
        type: request.body.type,
        element: request.body.element,
        referrer: request.body.referrer,
        device: ua.device,
        locale: locale.tag,
        website_id: website.id,
        metadata: {
          connect: metadata.map((meta) => ({ id: meta.id })),
        },
      },
    });

    return format(event);
  });

  fastify.post("/collect/:id", updateEvent);

  done();
};

const updateEvent = async (request, reply) => {
  const { id } = request.params;
  const { duration, seed } = request.body;

  // Get Website by seed
  const website = await Website.where("seed", seed).fetch();

  if (!website) {
    return reply.code(400).send({ message: "Aurora ID not defined.." });
  }

  try {
    await new Event()
      .where({ id: id, website_id: website.get("id") })
      .save({ duration: duration }, { patch: true });
  } catch (err) {
    console.log("Impossible to log duration.", err);
  }

  return reply.status(200);
};

module.exports = { collect };
