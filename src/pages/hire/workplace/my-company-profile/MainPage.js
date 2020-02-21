import React, {Fragment} from "react";
import {MDBBreadcrumb, MDBBreadcrumbItem, MDBCard, MDBCardBody, ToastContainer} from "mdbreact";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";

import {EFFECT} from "core/globals";
import {Fade} from "components/MyToast";
import Salary from "./partial/Salary";
import TextProperty from "./partial/TextProperty";
import Service from "services/hire/MyCompanyProfilesService";

import "./MainPage.scss";
import CoverPhoto from "./partial/CoverPhoto";

export default () => {
  const {t} = useTranslation();

  const pageTitle = t("NAVBAR.HIRE.WORKPLACE.MY_COMPANY_PROFILES");

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBCard>
        <MDBCardBody>
          <Fragment>
            <Salary/>
            <hr className="mt-md-4"/>
          </Fragment>
          <Fragment>
            <TextProperty title={t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.ABOUT")} onLoad={Service.loadAbout} onSave={Service.saveAbout}/>
            <hr className="mt-md-4"/>
          </Fragment>
          <Fragment>
            <TextProperty title={t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.VISION")} onLoad={Service.loadVision} onSave={Service.saveVision}/>
            <hr className="mt-md-4"/>
          </Fragment>
          <Fragment>
            <TextProperty title={t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.MISSION")} onLoad={Service.loadMission} onSave={Service.saveMission}/>
            <hr className="mt-md-4"/>
          </Fragment>
          <Fragment>
            <CoverPhoto/>
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
};
