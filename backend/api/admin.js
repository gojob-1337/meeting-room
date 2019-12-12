const router = require("express-promise-router")();

const context = require("../context");

const deviceRepresentation = ({ deviceId, createdAt, lastActivityAt, deviceType, calendarId, displayName, location, language, clockType, minutesForCheckIn, minutesForStartEarly, showAvailableRooms, showTentativeMeetings, isReadOnlyDevice, recurringMeetingsCheckInTolerance }) => ({
  id: deviceId,
  createdAt: new Date(createdAt).getTime(),
  deviceType,
  calendarId,
  displayName,
  location,
  minutesForCheckIn,
  minutesForStartEarly,
  showAvailableRooms,
  showTentativeMeetings,
  isReadOnlyDevice,
  recurringMeetingsCheckInTolerance,
  language: language || "en",
  clockType: clockType,
  isOnline: lastActivityAt > Date.now() - 70 * 1000,
  msSinceLastActivity: Date.now() - lastActivityAt
});

const userRepresentation = ({ createdAt, provider }, { displayName, photoUrl }, properties) => ({
  displayName,
  avatarUrl: photoUrl,
  createdAt: new Date(createdAt).getTime(),
  provider,
  properties
});

router.use("/admin", context.adminContext);

router.get("/admin/auth_urls", (req, res) => res.json({
  google: req.context.calendarProviders.google.getAuthUrl(),
  office365: req.context.calendarProviders.office365.getAuthUrl()
}));

router.get("/admin/logout", async (req, res) => {
  await req.context.removeSession(req, res);
  res.redirect("/?info=logout");
});

router.use("/admin", async function(req, res) {
  if (!req.context.session.adminUserId) {
    return res.sendStatus(403);
  }

  return "next";
});

router.get("/admin/user", async function(req, res) {
  const userOAuth = await req.context.storage.oauth.getByUserId(req.context.session.adminUserId);
  const userDetails = await req.context.calendarProvider.getUserDetails();
  const userProperties = await req.context.storage.userProperties.getProperties(req.context.session.adminUserId);

  res.json(userRepresentation(userOAuth, userDetails, userProperties));
});

router.put("/admin/user/property/:propertyId", async function(req, res) {
  await req.context.storage.userProperties.setProperty(req.context.session.adminUserId, req.params.propertyId, req.body.value);
  res.sendStatus(204);
});

router.get("/admin/calendar", async function(req, res) {
  res.json(await req.context.calendarProvider.getCalendars({ invalidateCache: true }));
});

router.get("/admin/device", async function(req, res) {
  const devices = await req.context.storage.devices.getDevicesForUser(req.context.session.adminUserId);
  res.json(devices.map(deviceRepresentation));
});

router.post("/admin/device", async function(req, res) {
  const device = await req.context.storage.devices.getDeviceByConnectionCode(req.body.connectionCode);

  if (!device) {
    return res.sendStatus(404);
  }

  console.log("connecting device: " + device.deviceId);

  await req.context.storage.devices.connectDevice(device.deviceId, req.context.session.adminUserId);

  res.json(deviceRepresentation(device));
});

router.put("/admin/device/:deviceId", async function(req, res) {
  const device = await req.context.storage.devices.getDeviceById(req.params.deviceId);

  if (!device || device.userId !== req.context.session.adminUserId) {
    res.status(404).send(`No device with id ${req.params.deviceId}`);
  }

  if (req.body.calendarId) {
    const calendarsFromProvider = await req.context.calendarProvider.getCalendars();

    for (let calendarId of req.body.calendarId.split(";")) {
      if (calendarId === "all-connected-devices") continue;

      if (!calendarsFromProvider.find(calendar => calendar.id === calendarId)) {
        return res.status(404).send(`No calendar with id ${calendarId}`);
      }
    }
  }

  await req.context.storage.devices.setDeviceOptions(req.params.deviceId, req.body);

  res.sendStatus(204);
});

router.delete("/admin/device/:deviceId", async function(req, res) {
  const device = await req.context.storage.devices.getDeviceById(req.params.deviceId);

  if (device && device.userId === req.context.session.adminUserId) {
    await req.context.storage.devices.removeDevice(req.params.deviceId, req.context.session.adminUserId);
  }

  res.sendStatus(204);
});

router.get("/admin/audit", async function(req, res) {
  const audit = await req.context.storage.audit.findEvents(req.context.session.adminUserId, req.query.getAll === "true");

  res.json(audit.map(({ calendarId, meetingSummary, eventType, createdAt }) => ({
    createdAt,
    eventType,
    calendarId,
    meetingSummary
  })));
});

module.exports = router;
