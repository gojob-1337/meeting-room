import React from "react";

import { PageLoaded } from "../../theme";
import HeaderAndFooterLayout from "../../theme/layouts/HeaderAndFooter";

import Header from "./Header";
import DevicesHeader from "./DevicesHeader";
import Devices from "./devices/Devices";
import ModalsContainer from "./modals/ModalsContainer";
import ConnectDeviceWizard from "./modals/wizard";
import Footer from "../Footer";

const Dashboard = () => (
  <HeaderAndFooterLayout header={<Header/>} footer={<Footer/>}>
    <PageLoaded/>
    <DevicesHeader/>
    <Devices/>
    <ModalsContainer/>
    <ConnectDeviceWizard/>
  </HeaderAndFooterLayout>
);

export default Dashboard;
