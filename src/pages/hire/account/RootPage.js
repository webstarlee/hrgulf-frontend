import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import {MDBContainer} from "mdbreact";

import routes from "core/routes";
import {ACCOUNT} from "core/globals";
import SignedInRoute from "components/SignedInRoute";
import Error404 from "components/Error404";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import BackToTop from "components/BackToTop";

import "./RootPage.scss";

const MainPage = lazy(() => import("./main/RootPage"));
const PasswordPage = lazy(() => import("./PasswordPage"));
const PersonalProfilePage = lazy(() => import("./personal-profile/RootPage"));
const CompanyProfilePage = lazy(() => import("./CompanyProfilePage"));
const EmailNotificationsPage = lazy(() => import("./EmailNotificationsPage"));

export default (props) => {
  return (
    <Fragment>
      <Navbar type={ACCOUNT.TYPE.HIRE}/>
      <MDBContainer className="section">
        <Switch>
          <SignedInRoute path={routes.hire.account.main} exact component={MainPage}/>
          <SignedInRoute path={routes.hire.account.password} component={PasswordPage}/>
          <SignedInRoute path={routes.hire.account.personalProfile} component={PersonalProfilePage}/>
          <SignedInRoute path={routes.hire.account.companyProfile} component={CompanyProfilePage}/>
          <SignedInRoute path={routes.hire.account.emailNotifications} component={EmailNotificationsPage}/>
          <Route component={Error404}/>
        </Switch>
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  );
}
