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
import NewQuestionnaire from "./partial/NewQuestionnaire";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./NewQuestionnairePage.scss";

export default () => {
  const {params} = useParams();
  const {t} = useTranslation();

  const [urlParams, setUrlParams] = useState({});

  let pageTitle = t(`HIRE.WORKPLACE.QUESTIONNAIRE.ADD.${!!urlParams.id ? "EDIT" : "ADD"}_QUESTIONNAIRE`);
  let backUrl = `${routes.hire.workplace.questionnaire.all}/${urlParams.page || 1}`;
  const addUrl = `${routes.hire.workplace.questionnaire.add}/${Base64.encode(JSON.stringify({
    page: urlParams.page,
  }))}`;

  useEffect(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, []);

  useMemo(e => {
    if (!!params) {
      try {
        const raw = Base64.decode(params);
        const json = JSON.parse(raw);
        setUrlParams(json);
      } catch (e) {

      }
    }
  }, [params, t]);

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem><Link to={backUrl}>{t("NAVBAR.HIRE.WORKPLACE.QUESTIONNAIRE")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <NewQuestionnaire id={urlParams.id} addUrl={addUrl} backUrl={backUrl} showNewButton={true}/>
    </Fragment>
  );

  return payload();
};
