import React, {Fragment, useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCol, MDBIcon, MDBRow} from "mdbreact";

import images from "core/images";
import {RESULT} from "core/globals";
import apis from "core/apis";
import Service from "services/AboutService";
import GlobalService from "services/GlobalService";

import "./AboutUsPage.scss";

export default () => {
  const {t} = useTranslation();

  const [brochure, setBrochure] = useState("");
  const [originBrochure, setOriginBrochure] = useState("");
  const [video, setVideo] = useState("");

  const lang = t("CODE");

  const navBar = document.getElementById("nav-bar");
  const topOffset = 60;

  useEffect(e => {
    Service.loadAboutUs({})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          const data = res.data;
          setBrochure(`${apis.assetsBaseUrl}${data.brochure}`);
          setOriginBrochure(data.originBrochure);
          setVideo(`${apis.assetsBaseUrl}${data.video}`);
        }
      });
  });

  const handleDownloadBrochure = e => {
    GlobalService.downloadFile({url: brochure, filename: originBrochure});
  };

  return (
    <Fragment>
      <Helmet>
        <title>{t("NAVBAR.ABOUT.US")} - {t("SITE_NAME")}</title>
      </Helmet>

      <div className="about-us-section">
        <img src={lang === "en" ? images.aboutUsEn : images.aboutUsAr} className={`about-us-img about-us-img-${lang}`} style={{top: topOffset,}}/>
        <h3 className="font-weight-bold mb-5 text-center h3-response">{t("ABOUT.US.HEADING")}</h3>
        <div className="text-left">
          <h5 className="h5-response">{t("ABOUT.US.DESCRIPTION")}</h5>
          <h5 className="h5-response mt-3"><span className="font-weight-bold">{t("NAVBAR.POSTS.POSTS")}: </span>{t("ABOUT.US.POSTS_DESCRIPTION")}</h5>
          <h5 className="h5-response mt-3"><span className="font-weight-bold">{t("NAVBAR.NEWS")}: </span>{t("ABOUT.US.NEWS_DESCRIPTION")}</h5>
          <h5 className="h5-response mt-3"><span className="font-weight-bold">{t("NAVBAR.VIDEO")}: </span>{t("ABOUT.US.VIDEO_DESCRIPTION")}</h5>
          <h5 className="h5-response mt-3"><span className="font-weight-bold">{t("NAVBAR.QUESTIONNAIRE.QUESTIONNAIRE")}: </span>{t("ABOUT.US.QUESTIONNAIRE_DESCRIPTION")}</h5>
          <h5 className="h5-response mt-3"><span className="font-weight-bold">{t("NAVBAR.VOTE.VOTE")}: </span>{t("ABOUT.US.VOTE_DESCRIPTION")}</h5>
          <h5 className="h5-response mt-3"><span className="font-weight-bold">{t("NAVBAR.CONTACT.US")}: </span>{t("ABOUT.US.CONTACT_US_DESCRIPTION")}</h5>
        </div>
      </div>
      <div>
        {!!brochure.length && <div className="text-left">
          <MDBBtn rounded="true" color="primary" onClick={handleDownloadBrochure}>
            <MDBIcon icon="file-pdf"/> {t("ABOUT.US.BROCHURE")}
          </MDBBtn>
        </div>}
        {!!video.length && <video className="w-100 mx-auto mt-4" autoPlay={true} controls={true}>
          <source src={video}/>
        </video>}
      </div>
    </Fragment>
  );
}
