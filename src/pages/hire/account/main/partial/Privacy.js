import React from "react";
import {useTranslation} from "react-i18next";
import {MDBCard, MDBCardBody} from "mdbreact";
import {Link} from "react-router-dom";

import routes from "core/routes";

import "./Privacy.scss";

export default () => {
  const {t} = useTranslation();

  const payload = () => (
    <MDBCard className="mt-4">
      <MDBCardBody>
        <h4 className="h4-responsive">
          {t("HIRE.MY_ACCOUNT.MAIN.PRIVACY_SETTINGS.HEADING")}
        </h4>
        <div className="mt-3">
          <Link to={routes.hire.account.controlShare}>{t("HIRE.MY_ACCOUNT.MAIN.PRIVACY_SETTINGS.CONTROL_SHARE")}</Link>
        </div>
      </MDBCardBody>
    </MDBCard>
  );

  return payload();
}