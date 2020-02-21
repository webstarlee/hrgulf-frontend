import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import SignedInRoute from "components/SignedInRoute";
import Error404 from "components/Error404";
import routes from "core/routes";

import "./RootPage.scss";

const MainPage = lazy(() => import("./MainPage"));

export default (props) => {
  return (
    <Fragment>
      <Switch>
        <SignedInRoute path={`${routes.hire.workplace.myCompanyProfiles}`} component={MainPage}/>
        <Route component={Error404}/>
      </Switch>
    </Fragment>
  );
}
