export const newDeviceDataSelector = state => ({
  connectionCode: state.connectDeviceWizard.connectionCode,
  deviceId: state.connectDeviceWizard.deviceId,
  deviceType: state.connectDeviceWizard.deviceType,
  calendarId: state.connectDeviceWizard.calendarId,
  language: state.connectDeviceWizard.language,
  clockType: state.connectDeviceWizard.clockType
});

export const editDeviceDataSelector = state => ({
  deviceId: state.editedDevice.data.id,
  deviceType: state.editedDevice.data.deviceType,
  calendarId: state.editedDevice.data.calendarId,
  displayName: state.editedDevice.data.displayName && state.editedDevice.data.displayName.trim(),
  location: state.editedDevice.data.location,
  language: state.editedDevice.data.language,
  clockType: state.editedDevice.data.clockType,
  minutesForCheckIn: state.editedDevice.data.minutesForCheckIn,
  minutesForStartEarly: state.editedDevice.data.minutesForStartEarly,
  showAvailableRooms: state.editedDevice.data.showAvailableRooms,
  showTentativeMeetings: state.editedDevice.data.showTentativeMeetings,
  isReadOnlyDevice: state.editedDevice.data.isReadOnlyDevice,
  recurringMeetingsCheckInTolerance: state.editedDevice.data.recurringMeetingsCheckInTolerance
});

export const isAuditLogVisibleSelector = state => state.auditLog.isVisible;
export const isAuditLogLoadingSelector = state => state.auditLog.isLoading;
export const auditLogEntriesSelector = state => state.auditLog.entries;

export const isGoogleAccountSelector = state => state.user && state.user.provider === "google";

export const removedDeviceIdSelector = state => state.removedDevice;

