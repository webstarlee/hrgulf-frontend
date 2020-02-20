import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import SignedInRoute from "components/SignedInRoute";
import Error404 from "components/Error404";
import routes from "core/routes";

import "./RootPage.scss";

const AllLettersPage = lazy(() => import("./AllLettersPage"));
const NewLetterPage = lazy(() => import("./NewLetterPage"));

export default (props) => {
  return (
    <Fragment>
      <Switch>
        <SignedInRoute path={`${routes.hire.workplace.letters.add}/:params?`} component={NewLetterPage}/>
        <SignedInRoute path={`${routes.hire.workplace.letters.all}/:page?`} component={AllLettersPage}/>
        <Route component={Error404}/>
      </Switch>
    </Fragment>
  );
}
