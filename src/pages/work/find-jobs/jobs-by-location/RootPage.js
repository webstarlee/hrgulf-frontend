import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import SignedInRoute from "components/SignedInRoute";
import Error404 from "components/Error404";
import routes from "core/routes";

import "./RootPage.scss";

const AllLocationsPage = lazy(() => import("./AllLocationsPage"));

export default (props) => {
  return (
    <Fragment>
      <Switch>
        <SignedInRoute path={routes.work.findJobs.jobsByLocation.main} exact component={AllLocationsPage}/>
        {/*<SignedInRoute path={`${routes.work.findJobs.jobsByRole.main}/:jobRoleId?`} component={AllRolesPage}/>*/}
        <Route component={Error404}/>
      </Switch>
    </Fragment>
  );
}
