import React, {Fragment} from "react";
import {MDBBreadcrumb, MDBBreadcrumbItem, MDBCard, MDBCardBody, ToastContainer} from "mdbreact";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";

import {EFFECT} from "core/globals";
import {Fade} from "components/MyToast";
import Avatar from "./patial/Avatar";
import PersonalInfo from "./patial/PersonalInfo";
import Password from "./patial/Password";

import "./AccountSettings.scss";
import AccountType from "./patial/AccountType";

export default (props) => {
  const {t} = useTranslation();

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{t("AUTH.SIGN_IN")} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("ACCOUNT.ACCOUNT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{t("ACCOUNT.SETTINGS")}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBCard>
        <MDBCardBody className="mx-md-4 mx-sm-1">
          <Fragment>
            <Avatar/>
            <hr className="mt-md-4"/>
          </Fragment>
          <Fragment>
            <PersonalInfo/>
            <hr className="mt-md-4"/>
          </Fragment>
          <Fragment>
            <Password/>
            <hr className="mt-md-4"/>
          </Fragment>
          <Fragment>
            <AccountType/>
            <hr className="mt-md-4"/>
          </Fragment>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer
        className="text-left"
        position={t("DIRECTION") === "ltr" ? "top-right" : "top-left"}
        dir={t("DIRECTION")}
        hideProgressBar={true}
        // newestOnTop={true}
        // autoClose={0}
        autoClose={EFFECT.TRANSITION_TIME5}
        closeButton={false}
        transition={Fade}/>
    </Fragment>
  );

  return payload();
}
