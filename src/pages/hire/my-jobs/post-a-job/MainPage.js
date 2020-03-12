import React, {Fragment, useEffect} from "react";
import {MDBBreadcrumb, MDBBreadcrumbItem, ToastContainer} from "mdbreact";
import {useTranslation} from "react-i18next";

import {EFFECT} from "core/globals";
import {Fade} from "components/MyToast";
import PostAJob from "./PostAJob";

import "./MainPage.scss";
import {Helmet} from "react-helmet";

export default (props) => {
  const {t} = useTranslation();



  useEffect(e => {
  }, [props]);

  const pageTitle = t("NAVBAR.HIRE.MY_JOBS.POST_A_JOB");

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.MY_JOBS.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <PostAJob/>
    </Fragment>
  );

  return payload();
};
