import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";

import routes from "core/routes";
import {ACCOUNT} from "core/globals";
import SignedInRoute from "components/SignedInRoute";
import Error404Page from "pages/common/Error404Page";

import "./RootPage.scss";

const FrontPage = lazy(() => import("./front/RootPage"));

export default (props) => {
  const accountType = ACCOUNT.TYPE.WORK;

  return (
    <Fragment>
      <Switch>
        <Route path={`${routes.hire.root}`} exact component={FrontPage}/>
        <Route component={() => <Error404Page accountType={accountType}/>}/>
      </Switch>
    </Fragment>
  );
}
