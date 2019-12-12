const ms = require("ms");
const Sequelize = require("sequelize");
const Storage = require("./storage");
const config = require("./config");

const GoogleCalendar = require("./services/google-calendar");
const Office365Calendar = require("./services/office365-calendar");

const storage = new Storage(
  new Sequelize(config.databaseUrl, {
    logging: process.env.NODE_ENV !== "production" && console.log
  })
);

const createContext = (cookieName, cookieTTL) => async (req, res) => {
  if (!cookieName) {
    req.context = { storage };
    return "next";
  }

  const session = await storage.session.getSession(req.get(cookieName) || req.cookies[cookieName]) || await storage.session.createSession();

  const device = session.deviceId && await storage.devices.getDeviceById(session.deviceId);
  const userId = session.adminUserId || (device && device.userId);

  const oauth = await storage.oauth.getByUserId(userId);

  const googleCalendarProvider = new GoogleCalendar(config.google, (oauth && oauth.provider === "google") ? oauth : null);
  const office365CalendarProvider = new Office365Calendar(config.office365, (oauth && oauth.provider) === "office365" ? oauth : null);

  req.context = {
    storage,
    calendarProvider: oauth && (oauth.provider === "office365" ? office365CalendarProvider : googleCalendarProvider),
    calendarProviders: {
      google: googleCalendarProvider,
      office365: office365CalendarProvider
    },
    session,
    removeSession: async () => {
      await storage.session.deleteSession(req.context.session.token);
      res.clearCookie(cookieName, { httpOnly: true });
    }
  };

  res.cookie(cookieName, session.token, { httpOnly: true, maxAge: cookieTTL });

  return "next";
};

exports.emptyContext = createContext();
exports.deviceContext = createContext("deviceSessionToken", ms("1 year"));
exports.adminContext = createContext("adminSessionToken", ms("1 day"));

