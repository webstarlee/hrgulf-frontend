import React, {Fragment, useState} from "react";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";

import {ACCOUNT} from "core/globals";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import BackToTop from "components/BackToTop";

import "./RootPage.scss";

export default () => {
  const {t} = useTranslation();

  const pageTitle = `${t("WORK.PAGE_TITLE")} - ${t("SITE_NAME")}`;
  // const pageTitle = `${t("NAVBAR.HOME")} - ${t("SITE_NAME")}`;

  return (
    <Fragment>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Navbar type={ACCOUNT.TYPE.WORK}/>
      <MDBContainer className="section front-section no-max-width my-0">
        <MDBRow className="banner">
          <MDBCol md="12">
            <h2 className="welcome-message text-center font-weight-bold text-stroke-white-2">{t("FRONT.WELCOME_MESSAGE")} - {t("SITE_NAME")}</h2>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  );
}
