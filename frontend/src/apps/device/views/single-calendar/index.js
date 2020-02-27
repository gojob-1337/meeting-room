import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import ReactImageFallback from "react-image-fallback";

import {
  calendarNameSelector,
  fontSizeSelector,
  isAmPmClockSelector,
  nextMeetingSelector,
  getRoomStatus,
  timestampSelector
} from "../../selectors/selectors";
import NextMeeting from "./NextMeeting";
import { deviceActions } from "apps/device/actions/actions";
import colors from "dark/colors";
import Time from "theme/components/Time";
import CurrentMeeting from "./CurrentMeeting";
import ActionsBar from "./actions-bar";
import Layout from "dark/Layout";
import i18next from "i18next";
import { usePageLoaded } from "./hooks";

const Header = styled.div`
  font-size: 1rem;
  padding: 1rem;
  color: ${colors.foreground.white};
`;
const CalendarDetails = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const CompanyLogo = styled.div`
  position: absolute;
  height: 3.5rem;
  top: .5rem;
  left: 1rem;
`;

const Footer = styled.div`
  font-size: 1rem;
  padding: 1rem;
  color: ${colors.foreground.white};
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RoomName = styled.div`
  font-size: 2.3rem;
  color: ${colors.foreground.white};
  padding: 1rem;
  text-shadow: 1px 2px 1px rgba(0,0,0,0.3);
`;

const AppVersion = styled.div`
  font-size: .5rem;
  color: ${colors.foreground.white};
  opacity: .5;
`;

const Button = styled.button`
  background: white;
  font-size: 0.8rem;
  padding: 0.3rem 1rem;
  margin: 0;
  font-weight: 500;
  border-radius: 0.3rem;
  border: none;
`;

const ActionsWrapper = styled.div`
  padding: 0.6rem 1rem;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const statusBg = (calendarName) => ({
  available: `linear-gradient(135deg, rgba(0,136,51,0.8) 0%, rgba(0,204,51,0.8) 100%), url("backgrounds/${calendarName}/bg.jpg");`,
  occupied: `linear-gradient(135deg, rgba(192,0,0,0.8) 0%, rgba(224,0,0,0.8) 100%), url("backgrounds/${calendarName}/bg.jpg");`,
  warning: `linear-gradient(135deg, rgba(0,85,153,0.8) 0%, rgba(0,119,187,0.8) 100%), url("backgrounds/${calendarName}/bg.jpg");`,
  checkin: `linear-gradient(135deg, rgba(254,104,0,0.8) 0%, rgba(251,59,0,0.8) 100%), url("backgrounds/${calendarName}/bg.jpg");`
});

const CalendarView = ({
  calendarName,
  nextMeeting,
  showAllCalendarsView,
  currentTimestamp,
  isAmPmClock,
  fontSize,
  roomStatus
}) => {
  usePageLoaded();
  const background = roomStatus && statusBg(calendarName)[roomStatus.status];

  return (
    <Layout flexbox fontSize={fontSize} fontFamily={"Lato, sans-serif"} background={background}>
      <Header>
        <CompanyLogo>
          <ReactImageFallback
            src="images/company.png"
            fallbackImage="images/logo/logo-64.png"
            alt="Company Logo"
            style={{ maxHeight: "100%", width: "auto" }}
          />
        </CompanyLogo>
        <CalendarDetails>
          <Button onClick={showAllCalendarsView}>{i18next.t("actions.find-room")}</Button>
        </CalendarDetails>
      </Header>

      <Spacer />

      <RoomInfo>
        <RoomName>{calendarName}</RoomName>
        <CurrentMeeting />
      </RoomInfo>

      <ActionsWrapper>
        <ActionsBar />
      </ActionsWrapper>

      <Spacer />

      {nextMeeting && <NextMeeting />}

      <Footer>
        <AppVersion>v{process.env.REACT_APP_VERSION}</AppVersion>
        <Time timestamp={currentTimestamp} ampm={isAmPmClock} blinking smallSuffix />
      </Footer>
    </Layout>
  );
};

const mapStateToProps = state => ({
  calendarName: calendarNameSelector(state),
  nextMeeting: nextMeetingSelector(state),
  currentTimestamp: timestampSelector(state),
  isAmPmClock: isAmPmClockSelector(state),
  fontSize: fontSizeSelector(state),
  roomStatus: getRoomStatus(state)
});

const mapDispatchToProps = dispatch => ({
  showAllCalendarsView: () => dispatch(deviceActions.showAllCalendarsView())
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarView);
