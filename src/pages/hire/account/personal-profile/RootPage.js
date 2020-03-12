import React, {Fragment} from "react";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import {MDBBreadcrumb, MDBBreadcrumbItem, MDBCol, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";

import routes from "core/routes";
import Avatar from "./partial/Avatar";
import PersonalInformation from "./partial/PersonalInformation";

import "./RootPage.scss";

export default () => {
  const {t} = useTranslation();

  const pageTitle = t("HIRE.MY_ACCOUNT.PERSONAL_PROFILE.PAGE_TITLE");

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem><Link to={routes.hire.account.main}>{t("NAVBAR.HIRE.ACCOUNT.MY_ACCOUNT")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>

      <MDBRow>
        <MDBCol md="12" className="text-left">
          <Avatar/>
          <PersonalInformation/>
        </MDBCol>
      </MDBRow>
    </Fragment>
  );

  return payload();
}