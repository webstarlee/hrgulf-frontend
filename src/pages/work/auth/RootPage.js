import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import {useTranslation} from "react-i18next";

import routes from "core/routes";
import {ACCOUNT} from "core/globals";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import BackToTop from "components/BackToTop";
import Error404 from "components/Error404";

import "./RootPage.scss";

const SignInPage = lazy(() => import("./SignInPage"));
const SignUpPage = lazy(() => import("./SignUpPage"));
const ForgotPasswordPage = lazy(() => import("./ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./ResetPasswordPage"));

export default () => {
  const {t} = useTranslation();
  return (
    <Fragment>
      <Navbar type={ACCOUNT.TYPE.HIRE}/>
      <MDBContainer>
        <MDBRow className={"section mb-5"}>
          <MDBCol lg="2" md="0"/>
          <MDBCol lg="8" md="12">
            <Switch>
              <Route path={routes.hire.auth.signIn} exact component={SignInPage}/>
              <Route path={routes.hire.auth.signUp} exact component={SignUpPage}/>
              <Route path={routes.hire.auth.forgotPassword} component={ForgotPasswordPage}/>
              <Route path={`${routes.hire.auth.resetPassword}/:email?/:token?`} component={ResetPasswordPage}/>
              <Route component={Error404}/>
            </Switch>
          </MDBCol>
          <MDBCol lg="2" md="0"/>
        </MDBRow>
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  );
}
