import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBBtn, MDBCol, MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions} from "mdbreact";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {RESULT} from "core/globals";
import helpers from "core/helpers";
import routes from "core/routes";
import myJobsAction from "actions/my-jobs";
import toast from "components/MyToast";
import QuestionnairesService from "services/hire/workplace/QuestionnairesService";
import Service from "services/hire/my-jobs/PostAJobService";

import "./AddQuestionnaire.scss";

export default ({onPrev, onNext}) => {
  const {t} = useTranslation();
  const {myJobs: {postAJob}, auth: {user}} = useSelector(state => state);
  const history = useHistory();
  const dispatch = useDispatch();

  const [questionnaires, setQuestionnaires] = useState([]);

  const lang = t("CODE");

  const initialValues = postAJob.questionnaire || {
    questionnaireId: "0",
  };

  const validationSchema = Yup.object().shape({
    // questionnaireId: Yup.string()
    //   .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.ADD_SPECIALTIES.SPECIALTIES")})),
  });

  const loadQuestionnaires = e => {
    QuestionnairesService.list({userId: user.id, pageSize: 10000})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setQuestionnaires(res.data);
        } else {
          setQuestionnaires([]);
        }
      })
      .catch(err => {
        setQuestionnaires([]);
      });
  };

  const handleAddQuestionnaire = e => {
    dispatch(myJobsAction.postAJob.setQuestionnaire(formikProps.values));
    history.push(routes.hire.myJobs.postAJob.addQuestionnaire);
  };

  const handleSubmit = (values, {setSubmitting}) => {
    const jobInformation = {
      ...postAJob.jobInformation,
      specialties: !!postAJob.specialties.specialties ? postAJob.specialties.specialties.join(",") : "",
      ...values,
    };
    const candidateRequirements = postAJob.candidateRequirements;

    setSubmitting(true);
    Service.postJob({jobInformation, candidateRequirements})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          toast.success(t(`HIRE.MY_JOBS.POST_A_JOB.MESSAGE.SUCCESSFULLY_${!postAJob.jobInformation.id ? "POSTED" : "EDITED"}`));
          !postAJob.jobInformation.id && dispatch(myJobsAction.postAJob.setJobInformation({
            ...postAJob.jobInformation,
            id: res.insertId,
          }));
        } else {
          toast.error(res.message);
        }
        setSubmitting(false);
      })
      .catch(err => {
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setSubmitting(false);
      });

  };

  const formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {values, touched, errors, setFieldValue, setValues, setTouched, setErrors, handleChange, handleBlur, isSubmitting} = formikProps;

  useEffect(e => {
    loadQuestionnaires();
  }, []);

  const payload = () => (
    <Fragment>
      <form onSubmit={formikProps.handleSubmit}>
        <h3 className="h3-responsive mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.STEPS.ADD_QUESTIONNAIRE")}</h3>
        <p className="text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.ADD_QUESTIONNAIRE.SUBHEADING")}</p>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.ADD_QUESTIONNAIRE.QUESTIONNAIRE")}</MDBCol>
          <MDBCol md="12" className="text-left">
            <input hidden id="questionnaireId" value={values.questionnaireId} onChange={handleChange} onBlur={handleBlur}/>
            {!!questionnaires.length && <MDBSelect className="my-0" outline search selected={values.questionnaireId} getValue={val => {
              helpers.triggerChangeEvent("questionnaireId", val[0])
            }}>
              <MDBSelectInput selected={t("HIRE.MY_JOBS.POST_A_JOB.ADD_QUESTIONNAIRE.NO_QUESTIONNAIRE")} />
              <MDBSelectOptions className="max-height-200">
                <MDBSelectOption value="0">{t("HIRE.MY_JOBS.POST_A_JOB.ADD_QUESTIONNAIRE.NO_QUESTIONNAIRE")}</MDBSelectOption>
                {questionnaires.map((item, index) => (
                  <MDBSelectOption key={index} value={item.id} checked={values.questionnaireId == item.id}>{item.name}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.specialties && !!errors.specialties && <div className="text-left invalid-field">{errors.specialties}</div>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="text-left mt-3">
            {/*<Link to={routes.hire.myJobs.postAJob.addQuestionnaire}>*/}
              <MDBBtn color="primary" size="sm" rounded onClick={handleAddQuestionnaire}>{t("HIRE.MY_JOBS.POST_A_JOB.ADD_QUESTIONNAIRE.ADD_QUESTIONNAIRE")}</MDBBtn>
            {/*</Link>*/}
          </MDBCol>
        </MDBRow>

        <div className="mt-4 mb-3 text-right">
          <MDBBtn type="button" color="warning" size="sm" rounded onClick={onPrev} disabled={!!isSubmitting}>{t("COMMON.BUTTON.BACK")}</MDBBtn>
          <MDBBtn type="submit" color="primary" size="sm" rounded onClick={formikProps.handleSubmit} disabled={!!isSubmitting}>{t(`HIRE.MY_JOBS.POST_A_JOB.BUTTON.${!postAJob.jobInformation.id ? "POST" : "EDIT"}`)}</MDBBtn>
        </div>
      </form>
    </Fragment>
  );

  return payload();
};
