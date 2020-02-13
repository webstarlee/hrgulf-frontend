import React, {lazy} from "react";
import {Switch, Route} from "react-router-dom";

import routes from "core/routes";
import SignedInRoute from "components/SignedInRoute";
import SignedOutRoute from "components/SignedOutRoute";
import Error404Page from "pages/common/Error404Page";

const AuthPage = lazy(() => import("pages/auth/RootPage"));
const ProfilePage = lazy(() => import("pages/profile/RootPage"));
const FrontPage = lazy(() => import("pages/front/RootPage"));
const ContactPage = lazy(() => import("pages/contact/RootPage"));
const AboutPage = lazy(() => import("pages/about/RootPage"));

export default () => (
  <Switch>
    <Route path={"/"} exact component={FrontPage}/>
    <SignedOutRoute path={routes.auth.root} component={AuthPage}/>
    <SignedInRoute path={routes.profile.root} component={ProfilePage}/>
    <Route path={routes.contact.root} component={ContactPage}/>
    <Route path={routes.about.root} component={AboutPage}/>
    {/*<Route path={routes.admin} exact render={() => (window.location.href = `${routes.admin}/`)}/>*/}
    <Route component={Error404Page}/>
  </Switch>
);
