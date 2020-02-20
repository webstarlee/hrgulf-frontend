import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import {MDBContainer} from "mdbreact";

import Navbar from "components/Navbar";
import SignedInRoute from "components/SignedInRoute";
import Footer from "components/Footer";
import BackToTop from "components/BackToTop";
import Error404 from "components/Error404";
import routes from "core/routes";

import "./RootPage.scss";

const WorkplacePage = lazy(() => import("./workplace/RootPage"));

export default (props) => {
  return (
    <Fragment>
      <Navbar/>
      <MDBContainer className={"section my-section"}>
        <Switch>
          <SignedInRoute path={`${routes.hire.workplace.root}`} component={WorkplacePage}/>
          <Route component={Error404}/>
        </Switch>
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  );
}
