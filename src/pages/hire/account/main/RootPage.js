import React, {Fragment} from "react";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import {MDBBreadcrumb, MDBBreadcrumbItem, MDBCol, MDBRow} from "mdbreact";

import Information from "./partial/Information";
import Privacy from "./partial/Privacy";
import Management from "./partial/Management";

import "./RootPage.scss";

export default () => {
  const {t} = useTranslation();

  const pageTitle = t("NAVBAR.HIRE.ACCOUNT.MY_ACCOUNT");

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>

      <MDBRow>
        <MDBCol md="12" className="text-left">
          <Information/>
          <Privacy/>
          <Management/>
        </MDBCol>
      </MDBRow>
    </Fragment>
  );

  return payload();
}