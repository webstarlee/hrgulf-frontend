import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import SignedInRoute from "components/SignedInRoute";
import Error404 from "components/Error404";
import routes from "core/routes";

import "./RootPage.scss";

const LettersPage = lazy(() => import("./letters/RootPage"));
const MyCompanyProfilesPage = lazy(() => import("./my-company-profile/RootPage"));
const QuestionnairePage = lazy(() => import("./questionnaire/RootPage"));
const EmployerTestPage = lazy(() => import("./employer-test/RootPage"));

export default (props) => {
  return (
    <Fragment>
      <Switch>
        <SignedInRoute path={routes.hire.workplace.letters.root} component={LettersPage}/>
        <SignedInRoute path={routes.hire.workplace.myCompanyProfiles.root} component={MyCompanyProfilesPage}/>
        <SignedInRoute path={routes.hire.workplace.questionnaire.root} component={QuestionnairePage}/>
        <SignedInRoute path={routes.hire.workplace.employerTest.root} component={EmployerTestPage}/>
        <Route component={Error404}/>
      </Switch>
    </Fragment>
  );
}
