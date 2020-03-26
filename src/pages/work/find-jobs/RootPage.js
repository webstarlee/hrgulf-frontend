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

const JobsByRolePage = lazy(() => import("./jobs-by-role/RootPage"));
const JobsByLocationPage = lazy(() => import("./jobs-by-location/RootPage"));
const JobsBySectorPage = lazy(() => import("./jobs-by-sector/RootPage"));
const JobsByCompaniesPage = lazy(() => import("./jobs-by-companies/RootPage"));

export default (props) => {
  return (
    <Fragment>
      <Navbar type={ACCOUNT.TYPE.WORK}/>
      <MDBContainer className="section">
        <Switch>
          <Route path={routes.work.findJobs.jobsByRole.root} component={JobsByRolePage}/>
          <Route path={routes.work.findJobs.jobsByLocation.root} component={JobsByLocationPage}/>
          <Route path={routes.work.findJobs.jobsBySector.root} component={JobsBySectorPage}/>
          <Route path={routes.work.findJobs.jobsByCompanies.root} component={JobsByCompaniesPage}/>
          <Route component={Error404}/>
        </Switch>
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  );
}
