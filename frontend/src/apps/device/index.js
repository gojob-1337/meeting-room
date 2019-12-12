import React from "react";
import { Provider } from "react-redux";

import store from "./store";
import { deviceActions } from "./actions/actions";
import DisplayOptionsBar from "./components/DisplayOptionsBar";

import { getDeviceDetails, setHeader } from "../../services/api";
import { IconContext } from "react-icons";

export default class Device extends React.Component {
  async componentDidMount() {
    if (module.hot) {
      module.hot.accept("./router", () => this.forceUpdate());
    }

    if (this.props.match.params.sessionToken) {
      setHeader("deviceSessionToken", this.props.match.params.sessionToken);
      await getDeviceDetails().then(undefined, () => (window.location.href = "/"));
    }

    store.dispatch(deviceActions.initialize());
  }

  render() {
    const Router = require("./router").default;

    return (
      <Provider store={store}>
        <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
          <Router />
          <DisplayOptionsBar />
        </IconContext.Provider>
      </Provider>
    );
  }
}
