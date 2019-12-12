import React from "react";
import { Provider } from "react-redux";
import { IconContext } from "react-icons";

import { adminActions } from "apps/admin/store/actions";
import { getUserDetails } from "services/api";

import store from "./store";

class AdminApp extends React.PureComponent {
  componentDidMount() {
    getUserDetails().then(null, () => window.location = "/");

    store.dispatch(adminActions.initialFetch());

    if (module.hot) {
      module.hot.accept("./Dashboard", () => this.forceUpdate());
    }
  }

  render() {
    const Dashboard = require("./Dashboard").default;

    return (
      <Provider store={store}>
        <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
          <Dashboard/>
        </IconContext.Provider>
      </Provider>
    );
  }
}

export default AdminApp;
