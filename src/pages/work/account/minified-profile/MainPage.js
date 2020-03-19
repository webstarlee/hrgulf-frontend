import React, {Fragment, useEffect} from "react";
import {MDBBreadcrumb, MDBBreadcrumbItem} from "mdbreact";
import {useTranslation} from "react-i18next";
import MinifiedProfile from "./MinifiedProfile";

import "./MainPage.scss";
import {Helmet} from "react-helmet";

export default (props) => {
  const {t} = useTranslation();

  useEffect(e => {
  }, [props]);

  const pageTitle = t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.PAGE_TITLE");

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.WORK.ACCOUNT.MY_ACCOUNT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MinifiedProfile/>
    </Fragment>
  );

  return payload();
};
