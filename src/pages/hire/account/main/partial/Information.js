import React from "react";
import {useTranslation} from "react-i18next";
import {MDBCard, MDBCardBody} from "mdbreact";
import {Link} from "react-router-dom";

import routes from "core/routes";

import "./Information.scss";

export default () => {
  const {t} = useTranslation();

  const payload = () => (
    <MDBCard>
      <MDBCardBody>
        <h4 className="h4-responsive">
          {t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.HEADING")}
        </h4>
        <div className="mt-3">
          <Link to={routes.hire.account.password}>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.PASSWORD")}</Link>
          <p>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.PASSWORD_DESCRIPTION")}</p>
        </div>
        <div className="mt-3">
          <Link to={routes.hire.account.personalProfile}>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.PERSONAL_PROFILE")}</Link>
          <p>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.PERSONAL_PROFILE_DESCRIPTION")}</p>
        </div>
        <div className="mt-3">
          <Link to={routes.hire.account.companyProfile}>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.COMPANY_PROFILE")}</Link>
          <p>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.COMPANY_PROFILE_DESCRIPTION")}</p>
        </div>
        <div className="mt-3">
          <Link to={routes.hire.account.emailNotifications}>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.EMAIL_NOTIFICATIONS")}</Link>
          <p>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.EMAIL_NOTIFICATIONS_DESCRIPTION")}</p>
        </div>
        <div className="mt-3">
          <Link to={routes.hire.account.emailSpecialties}>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.EMAIL_SPECIALTIES")}</Link>
          <p>{t("HIRE.MY_ACCOUNT.MAIN.INFORMATION.EMAIL_SPECIALTIES_DESCRIPTION")}</p>
        </div>
      </MDBCardBody>
    </MDBCard>
  );

  return payload();
}