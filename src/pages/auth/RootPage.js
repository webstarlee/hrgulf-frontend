import React, {Fragment, lazy} from "react";
import {Route, Switch} from "react-router-dom";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import {useTranslation} from "react-i18next";

import routes from "core/routes";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import BackToTop from "components/BackToTop";
import Error404 from "components/Error404";
import images from "core/images";

import "./RootPage.scss";

const SignInPage = lazy(() => import("./SignInPage"));
const SignUpPage = lazy(() => import("./SignUpPage"));
const GoogleSignUpPage = lazy(() => import("./GoogleSignUpPage"));
const ForgotPasswordPage = lazy(() => import("./ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./ResetPasswordPage"));

export default () => {
  const {t} = useTranslation();

  return (
    <Fragment>
      <Navbar/>
      <MDBContainer>
        <MDBRow className={"section mb-5"}>
          <MDBCol lg="3" md="0"/>
          <MDBCol lg="6" md="12">
            <Switch>
              <Route path={routes.auth.signIn} exact component={SignInPage}/>
              <Route path={routes.auth.signUp} exact component={SignUpPage}/>
              <Route path={`${routes.auth.googleSignUp}/:email/:firstName?/:lastName?/:id_token?`} exact component={GoogleSignUpPage}/>
              <Route path={routes.auth.forgotPassword} component={ForgotPasswordPage}/>
              <Route path={`${routes.auth.resetPassword}/:email?/:token?`} component={ResetPasswordPage}/>
              <Route component={Error404}/>
            </Switch>
          </MDBCol>
          <MDBCol lg="3" md="0"/>
        </MDBRow>
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  );
}
