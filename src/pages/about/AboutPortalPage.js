import React, {Fragment} from "react";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCol, MDBRow} from "mdbreact";
import images from "core/images";

import "./AboutPortalPage.scss";

export default () => {
  const {t} = useTranslation();

  return (
    <Fragment>
      <Helmet>
        <title>{t("NAVBAR.ABOUT.PORTAL")} - {t("SITE_NAME")}</title>
      </Helmet>
      <div className="front-section">
        <h3 className="font-weight-bold mb-5 text-center text-uppercase h3-response">{t("ABOUT.PORTAL.HEADING")}</h3>
        <MDBRow>
          <MDBCol className="mb-5" md={4}>
            <MDBCard className="section-card">
              <MDBCardImage className="img-fluid about-card-image mx-auto" src={images.vision} waves />
              <MDBCardBody>
                <p className="h5 text-center text-black-50 mt-4">{t("ABOUT.PORTAL.VISION_TITLE")}</p>
                <MDBCardText className="text-center mt-4">{t("ABOUT.PORTAL.VISION_DESCRIPTION")}</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol className="mb-5" md={4}>
            <MDBCard className="section-card">
              <MDBCardImage className="img-fluid about-card-image mx-auto" src={images.mission} waves />
              <MDBCardBody>
                <p className="h5 text-center text-black-50 mt-4">{t("ABOUT.PORTAL.MISSION_TITLE")}</p>
                <MDBCardText className="text-center mt-4">{t("ABOUT.PORTAL.MISSION_DESCRIPTION")}</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol className="mb-5" md={4}>
            <MDBCard className="section-card">
              <MDBCardImage className="img-fluid about-card-image mx-auto" src={images.goal} waves />
              <MDBCardBody>
                <p className="h5 text-center text-black-50 mt-4">{t("ABOUT.PORTAL.GOAL_TITLE")}</p>
                <MDBCardText className="text-center mt-4">{t("ABOUT.PORTAL.GOAL_DESCRIPTION")}</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </div>
    </Fragment>
  );
}
