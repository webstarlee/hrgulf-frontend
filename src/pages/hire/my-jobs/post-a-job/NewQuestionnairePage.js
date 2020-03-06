import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {MDBBreadcrumb, MDBBreadcrumbItem} from "mdbreact";
import {useTranslation} from "react-i18next";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {Base64} from "js-base64";
import {useSelector} from "react-redux";

import {EFFECT} from "core/globals";
import routes from "core/routes";
import NewQuestionnaire from "pages/hire/workplace/questionnaire/partial/NewQuestionnaire";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./NewQuestionnairePage.scss";

export default () => {
  const {t} = useTranslation();

  let pageTitle = t("HIRE.MY_JOBS.POST_A_JOB.ADD_QUESTIONNAIRE.ADD_QUESTIONNAIRE");
  let backUrl = routes.hire.myJobs.postAJob.main;
  const addUrl = routes.hire.myJobs.postAJob.addQuestionnaire;

  useEffect(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, []);

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.MY_JOBS.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem><Link to={backUrl}>{t("NAVBAR.HIRE.MY_JOBS.POST_A_JOB")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <NewQuestionnaire id={null} addUrl={addUrl} backUrl={backUrl} showNewButton={false}/>
    </Fragment>
  );

  return payload();
};