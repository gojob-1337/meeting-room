import { action } from "utils/redux";

import {
  connectDevice,
  disconnectDevice,
  getAuditLog,
  getCalendars,
  getConnectedDevices,
  getUserDetails,
  setOptionsForDevice,
} from "services/api";

import {
  editDeviceDataSelector,
  newDeviceDataSelector,
  removedDeviceIdSelector,
} from "./selectors";

export const adminActions = {
  $setDevices: action(devices => ({ devices })),
  $setCalendars: action(calendars => ({ calendars })),
  $setUserDetails: action(user => ({ user })),
  $setUserProperty: action((propertyId, value) => ({ propertyId, value })),
  initialFetch: () => async dispatch => {
    const [calendars, devices, user] = await Promise.all([
      getCalendars(),
      getConnectedDevices(),
      getUserDetails()
    ]);

    dispatch(adminActions.$setCalendars(calendars));
    dispatch(adminActions.$setUserDetails(user));
    dispatch(adminActions.$setDevices(devices));
  }
};

export const connectDeviceWizardActions = {
  $show: action(),
  show: () => async (dispatch) => {
    dispatch(connectDeviceWizardActions.$show());
  },
  hide: action(),

  $setSubmitButton: action(submitButton => ({ submitButton })),
  submit: (submitButton, openEditDialog = false) => async (dispatch, getState) => {
    dispatch(connectDeviceWizardActions.$setSubmitButton(submitButton));

    const { deviceId, deviceType, calendarId, language, clockType } = newDeviceDataSelector(getState());

    await setOptionsForDevice(deviceId, deviceType, calendarId, "", "", language, 0, 5, true, true, false, clockType, 0);

    const allDevices = await getConnectedDevices();
    dispatch(adminActions.$setDevices(allDevices));
    dispatch(connectDeviceWizardActions.hide());

    if (openEditDialog) {
      dispatch(editDeviceDialogActions.show(allDevices.find(x => x.id === deviceId)));
    }

    dispatch(adminActions.$setUserDetails(await getUserDetails()));
  },
  firstStep: {
    setConnectionCode: action(connectionCode => ({ connectionCode })),
    $startSubmitting: action(),
    $submitSuccess: action(deviceId => ({ deviceId })),
    $submitError: action(errorMessage => ({ errorMessage })),
    submit: () => async (dispatch, getState) => {
      dispatch(connectDeviceWizardActions.firstStep.$startSubmitting());

      try {
        const { connectionCode } = newDeviceDataSelector(getState());
        const device = await connectDevice(connectionCode);

        dispatch(connectDeviceWizardActions.firstStep.$submitSuccess(device.id));
      } catch (error) {
        const isInvalidConnectionCode = error.response && error.response.status === 404;
        const errorMessage = isInvalidConnectionCode ? "Invalid connection code" : "Unknown error. Please try again later";

        dispatch(connectDeviceWizardActions.firstStep.$submitError(errorMessage));
      }
    }
  },
  secondStep: {
    setDeviceType: action(deviceType => ({ deviceType })),
    nextStep: action()
  },
  thirdStep: {
    setCalendarId: action(calendarId => ({ calendarId })),
    setLanguage: action(language => ({ language })),
    setClockType: action(clockType => ({ clockType })),
    previousStep: action(),
    submit: () => async dispatch => {
      dispatch(connectDeviceWizardActions.submit(false));
    }
  }
};

export const editDeviceDialogActions = {
  show: action(device => ({ device })),
  hide: action(),
  setDeviceType: action(deviceType => ({ deviceType })),
  setCalendarId: action(calendarId => ({ calendarId })),
  setDisplayName: action(displayName => ({ displayName })),
  setLocation: action(location => ({ location })),
  setLanguage: action(language => ({ language })),
  setClockType: action(clockType => ({ clockType })),
  setMinutesForCheckIn: action(minutesForCheckIn => ({ minutesForCheckIn })),
  setMinutesForStartEarly: action(minutesForStartEarly => ({ minutesForStartEarly })),
  setShowAvailableRooms: action(showAvailableRooms => ({ showAvailableRooms })),
  setShowTentativeMeetings: action(showTentativeMeetings => ({ showTentativeMeetings })),
  setReadOnlyDevice: action(isReadOnlyDevice => ({ isReadOnlyDevice })),
  setRecurringMeetingsCheckInTolerance: action(recurringMeetingsCheckInTolerance => ({ recurringMeetingsCheckInTolerance })),
  $startSubmitting: action(),
  submit: () => async (dispatch, getState) => {
    const { deviceId, deviceType, calendarId, displayName, location, language, minutesForCheckIn, minutesForStartEarly, showAvailableRooms, showTentativeMeetings, isReadOnlyDevice, clockType, recurringMeetingsCheckInTolerance } = editDeviceDataSelector(getState());

    dispatch(editDeviceDialogActions.$startSubmitting());
    await setOptionsForDevice(deviceId, deviceType, calendarId, displayName, location, language, minutesForCheckIn, minutesForStartEarly, showAvailableRooms, showTentativeMeetings, isReadOnlyDevice, clockType, recurringMeetingsCheckInTolerance);

    dispatch(adminActions.$setDevices(await getConnectedDevices()));
    dispatch(editDeviceDialogActions.hide());
  }
};

export const removeDeviceDialogActions = {
  show: action(device => ({ deviceId: device.id })),
  hide: action(),
  submit: () => async (dispatch, getState) => {
    await disconnectDevice(removedDeviceIdSelector(getState()));

    dispatch(adminActions.$setDevices(await getConnectedDevices()));
    dispatch(removeDeviceDialogActions.hide());
  }
};

export const auditLogActions = {
  $entriesLoadingStarted: action(),
  $setEntries: action(entries => ({ entries })),
  $show: action(),

  hide: action(),
  show: () => async (dispatch) => {
    dispatch(auditLogActions.$entriesLoadingStarted());
    dispatch(auditLogActions.$show());
    dispatch(auditLogActions.$setEntries(await getAuditLog()));
  }
};
