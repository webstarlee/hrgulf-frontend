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

const MinifiedProfilePage = lazy(() => import("./minified-profile/RootPage"));

export default (props) => {
  return (
    <Fragment>
      <Navbar type={ACCOUNT.TYPE.WORK}/>
      <MDBContainer className="section">
        <Switch>
          <SignedInRoute path={routes.work.account.minifiedProfile.root} component={MinifiedProfilePage}/>
          <Route component={Error404}/>
        </Switch>
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  );
}
