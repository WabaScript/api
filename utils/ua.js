const UAParser = require("ua-parser-js");

const parse = (ua) => {
  const elements = [];
  const parsed = new UAParser(ua).getResult();

  const device = parsed.device.type ? parsed.device.type : "desktop";

  if (parsed.browser && parsed.browser.name && parsed.browser.version) {
    elements.push({
      type: "browser",
      name: parsed.browser.name,
      version: parsed.browser.version,
    });
  }

  if (parsed.os && parsed.os.name && parsed.os.version) {
    elements.push({
      type: "os",
      name: parsed.os.name,
      version: parsed.os.version,
    });
  }

  if (parsed.engine && parsed.engine.name && parsed.engine.version) {
    elements.push({
      type: "engine",
      name: parsed.engine.name,
      version: parsed.engine.version,
    });
  }

  return {
    device: device,
    elements: elements,
  };
};

module.exports = { parse };
