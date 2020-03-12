import React from "react";
import {useTranslation} from "react-i18next";
import {MDBCard, MDBCardBody} from "mdbreact";
import {Link} from "react-router-dom";

import routes from "core/routes";

import "./Management.scss";

export default () => {
  const {t} = useTranslation();

  const payload = () => (
    <MDBCard className="mt-4">
      <MDBCardBody>
        <h4 className="h4-responsive">
          {t("HIRE.MY_ACCOUNT.MAIN.MANAGEMENT.HEADING")}
        </h4>
        <div className="mt-3">
          <Link to={routes.hire.account.userManagement}>{t("HIRE.MY_ACCOUNT.MAIN.MANAGEMENT.USER_MANAGEMENT")}</Link>
          <p>{t("HIRE.MY_ACCOUNT.MAIN.MANAGEMENT.USER_MANAGEMENT_DESCRIPTION")}</p>
        </div>
        <div className="mt-3">
          <Link to={routes.hire.account.cvTags}>{t("HIRE.MY_ACCOUNT.MAIN.MANAGEMENT.CV_TAGS")}</Link>
          <p>{t("HIRE.MY_ACCOUNT.MAIN.MANAGEMENT.CV_TAGS_DESCRIPTION")}</p>
        </div>
      </MDBCardBody>
    </MDBCard>
  );

  return payload();
}