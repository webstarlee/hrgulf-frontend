import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";

import routes from "core/routes";
import {ACCOUNT} from "core/globals";
import SignedInRoute from "components/SignedInRoute";
import Error404Page from "pages/common/Error404Page";

import "./RootPage.scss";

const FrontPage = lazy(() => import("./front/RootPage"));
const AuthPage = lazy(() => import("./auth/RootPage"));
const WorkplacePage = lazy(() => import("./workplace/RootPage"));
const MyJobsPage = lazy(() => import("./my-jobs/RootPage"));

export default (props) => {
  const accountType = ACCOUNT.TYPE.HIRE;
  return (
    <Fragment>
      <Switch>
        <Route path={`${routes.hire.root}`} exact component={FrontPage}/>
        <Route path={`${routes.hire.auth.root}`} component={AuthPage}/>
        <SignedInRoute path={`${routes.hire.workplace.root}`} component={WorkplacePage} type={accountType}/>
        <SignedInRoute path={`${routes.hire.myJobs.root}`} component={MyJobsPage} type={accountType}/>
        <Route component={() => <Error404Page accountType={accountType}/>}/>
      </Switch>
    </Fragment>
  );
}
