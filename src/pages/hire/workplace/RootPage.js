import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import SignedInRoute from "components/SignedInRoute";
import Error404 from "components/Error404";
import routes from "core/routes";

import "./RootPage.scss";

const LettersPage = lazy(() => import("./letters/RootPage"));

export default (props) => {
  return (
    <Fragment>
      <Switch>
        <SignedInRoute path={`${routes.hire.workplace.letters.root}`} component={LettersPage}/>
        <Route component={Error404}/>
      </Switch>
    </Fragment>
  );
}
