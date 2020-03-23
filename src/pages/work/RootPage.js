import React, {Fragment, lazy, useState} from "react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

import routes from "core/routes";
import {ACCOUNT} from "core/globals";
import SignedInRoute from "components/SignedInRoute";
import SignedOutRoute from "components/SignedOutRoute";
import Error404Page from "pages/common/Error404Page";

import "./RootPage.scss";

const FrontPage = lazy(() => import("./front/RootPage"));
const AuthPage = lazy(() => import ("./auth/RootPage"));
const MyCVPage = lazy(() => import ("./my-cv/RootPage"));
const AccountPage = lazy(() => import ("./account/RootPage"));

export default (props) => {
  const {auth} = useSelector(state => state);
  const history = useHistory();
  const accountType = ACCOUNT.TYPE.WORK;

  const pathname = history.location.pathname;
  const minifiedProfilePath = routes.work.account.minifiedProfile.root;

  return (
    <Fragment>
      <Switch>
        {!!auth && !!auth.work && !auth.work.isVisited && !pathname.startsWith(minifiedProfilePath) && <Redirect to={minifiedProfilePath} />}
        <Route path={`${routes.work.root}`} exact component={FrontPage}/>
        <SignedOutRoute path={`${routes.work.auth.root}`} component={AuthPage}/>
        <SignedInRoute path={`${routes.work.myCV.root}`} component={MyCVPage}/>
        <SignedInRoute path={`${routes.work.account.root}`} component={AccountPage}/>
        <Route component={() => <Error404Page accountType={accountType}/>}/>
      </Switch>
    </Fragment>
  );
}
