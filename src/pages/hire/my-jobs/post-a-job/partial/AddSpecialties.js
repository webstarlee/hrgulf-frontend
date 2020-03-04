import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBBtn, MDBChipsInput, MDBCol, MDBRow} from "mdbreact";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";

import {KEY_CODES, RESULT} from "core/globals";
import myJobsAction from "actions/my-jobs";
import CoreService from "services/CoreService";

import "./AddSpecialties.scss";

export default ({onPrev, onNext}) => {
  const {t} = useTranslation();
  const {myJobs: {postAJob}} = useSelector(state => state);
  const dispatch = useDispatch();

  const [specialties, setSpecialties] = useState([]);

  const lang = t("CODE");

  const initialValues = postAJob.specialties || {
    specialties: [],
  };

  const validationSchema = Yup.object().shape({
    specialties: Yup.array()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.ADD_SPECIALTIES.SPECIALTIES")})),
  });

  const loadSpecialties = e => {
    CoreService.getCareerLevels()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setSpecialties(res.data);
        } else {
          setSpecialties([]);
        }
      })
      .catch(err => {
        setSpecialties([]);
      });
  };

  const handleKeyPress = (event) => {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  };

  const handleSubmit = (values, {setSubmitting}) => {
    const params = {
      ...values,
    };

    dispatch(myJobsAction.postAJob.setSpecialties(params));;
    setSubmitting(false);
    !!onNext && onNext(3);
  };

  const formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {values, touched, errors, setFieldValue, setValues, setTouched, setErrors, handleChange, handleBlur, isSubmitting} = formikProps;

  useEffect(e => {
    loadSpecialties();
  }, []);

  const payload = () => (
    <Fragment>
      <form onSubmit={formikProps.handleSubmit} onKeyPress={handleKeyPress}>
        <h3 className="h3-responsive mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.STEPS.ADD_SPECIALTIES")}</h3>
        <p className="text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.ADD_SPECIALTIES.SUBHEADING")}</p>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.ADD_SPECIALTIES.SPECIALTIES")}</MDBCol>
          <MDBCol md="12" className="text-left">
            <MDBChipsInput outline className="my-0" chips={values.specialties} getValue={chips => setFieldValue("specialties", chips)} />
            {!!touched.specialties && !!errors.specialties && <div className="text-left invalid-field">{errors.specialties}</div>}
          </MDBCol>
        </MDBRow>

        <div className="mt-4 mb-3 text-right">
          <MDBBtn type="button" color="warning" size="sm" rounded onClick={onPrev} disabled={!!isSubmitting}>{t("COMMON.BUTTON.BACK")}</MDBBtn>
          <MDBBtn type="button" color="primary" size="sm" rounded onClick={formikProps.handleSubmit} disabled={!!isSubmitting}>{t("COMMON.BUTTON.NEXT")}</MDBBtn>
        </div>
      </form>
    </Fragment>
  );

  return payload();
};
