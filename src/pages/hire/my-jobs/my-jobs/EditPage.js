import React, {Fragment, useEffect, useMemo, useState} from "react";
import {MDBBreadcrumb, MDBBreadcrumbItem, MDBModal, ToastContainer} from "mdbreact";
import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Base64} from "js-base64";
import {useDispatch} from "react-redux";

import routes from "core/routes";
import {EFFECT, LAYOUT, RESULT} from "core/globals";
import Loading from "components/Loading";
import toast, {Fade} from "components/MyToast";
import myJobsAction from "actions/my-jobs";
import PostAJob from "../post-a-job/PostAJob";
import Service from "services/hire/my-jobs/MyJobsService";

import "./EditPage.scss";

export default (props) => {
  const {params} = useParams();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [urlParams, setUrlParams] = useState({});

  const pageTitle = t("HIRE.MY_JOBS.MY_JOBS.EDIT_JOB.PAGE_TITLE");
  let backUrl = `${routes.hire.myJobs.myJobs.main}/${urlParams.page || 1}`;

  const loadData = e => {
    setLoading(true);
    Service.get({id: urlParams.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          const {jobInformation, candidateRequirements} = res.data;
          if (!!jobInformation && !!candidateRequirements) {
            dispatch(myJobsAction.postAJob.resetAll());
            dispatch(myJobsAction.postAJob.setJobInformation(jobInformation));
            dispatch(myJobsAction.postAJob.setCandidateRequirements(candidateRequirements));
            dispatch(myJobsAction.postAJob.setSpecialties({specialties: jobInformation.specialties && jobInformation.specialties.split(",")}));
            dispatch(myJobsAction.postAJob.setQuestionnaire({questionnaireId: jobInformation.questionnaireId}));
            dispatch(myJobsAction.postAJob.setStep({
              step: 1,
              pendingStep: 4,
            }));
          } else {
            toast.error(t("COMMON.ERROR.NO_DATA"));
          }
        } else {
          toast.error(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setLoading(false);
      });
  };

  useEffect(e => {

  }, [props]);

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

  useMemo(e => {
    !!urlParams.id && loadData();
  }, [urlParams.id]);

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.MY_JOBS.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem><Link to={backUrl}>{t("NAVBAR.HIRE.MY_JOBS.MY_JOBS")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      {!!loading && <Loading style={{height: LAYOUT.LISTVIEW_HEIGHT}}/>}
      {!loading && <PostAJob backLink={routes.hire.myJobs.myJobs.main}/>}
    </Fragment>
  );

  return payload();
};
