import React, {Fragment} from "react";
import {MDBContainer} from "mdbreact";
import {useTranslation} from "react-i18next";

import Navbar from "components/Navbar";
import Footer from "components/Footer";
import BackToTop from "components/BackToTop";
import Error404 from "components/Error404";

import "./Error404Page.scss";

export default () => {
  const {t} = useTranslation();

  return (
    <Fragment>
      <Navbar/>
      <MDBContainer className="section">
        <Error404 />
      </MDBContainer>
      <Footer/>
      <BackToTop/>
    </Fragment>
  )
};