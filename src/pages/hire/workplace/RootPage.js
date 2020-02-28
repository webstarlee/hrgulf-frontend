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

const LettersPage = lazy(() => import("./letters/RootPage"));
const MyCompanyProfilesPage = lazy(() => import("./my-company-profile/RootPage"));
const QuestionnairePage = lazy(() => import("./questionnaire/RootPage"));
const EmployerTestPage = lazy(() => import("./employer-test/RootPage"));

export default (props) => {
  return (
    <Fragment>
      <Navbar type={ACCOUNT.TYPE.HIRE}/>
      <MDBContainer className="section">
        <Switch>
          <SignedInRoute path={routes.hire.workplace.letters.root} component={LettersPage}/>
          <SignedInRoute path={routes.hire.workplace.myCompanyProfiles.root} component={MyCompanyProfilesPage}/>
          <SignedInRoute path={routes.hire.workplace.questionnaire.root} component={QuestionnairePage}/>
          <SignedInRoute path={routes.hire.workplace.employerTest.root} component={EmployerTestPage}/>
          <Route component={Error404}/>
        </Switch>
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  );
}
