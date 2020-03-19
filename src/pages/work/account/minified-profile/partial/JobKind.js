import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBBtn, MDBCol, MDBInput, MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions} from "mdbreact";
import {useFormik} from "formik";
import {useHistory} from "react-router-dom";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {animateScroll as scroll} from "react-scroll";

import {DELAY, EFFECT, RESULT} from "core/globals";
import helpers from "core/helpers";
import minifiedProfileActions from "actions/minified-profile";
import useDebounce from "helpers/useDebounce";
import CoreService from "services/CoreService";

import "./JobKind.scss";

export default ({onPrev, onNext}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {work}, minifiedProfile} = useSelector(state => state);
  const dispatch = useDispatch();

  const [jobRoles, setJobRoles] = useState([]);
  const [rawJobRoles, setRawJobRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [visaStatuses, setVisaStatuses] = useState([]);
  const [careerLevels, setCareerLevels] = useState([]);

  const [jobRoleSearch, setJobRoleSearch] = useState("");

  const debouncedJobRoleSearch = useDebounce(jobRoleSearch, DELAY.DELAY2);

  const lang = t("CODE");

  const initialValues = minifiedProfile || {
    jobTitle: "",
    jobRoleId: 0,
    jobLocationId: 5,
    jobVisaStatusId: 3,
    careerLevel: 0,
  };

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_TITLE")})),
    jobRoleId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_ROLE")})),
    jobLocationId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_LOCATION")})),
    jobVisaStatusId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_VISA_STATUS")})),
    careerLevel: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.CAREER_LEVEL")})),
  });

  const loadJobRoles = e => {
    CoreService.getJobRoles()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setRawJobRoles(res.data);
        } else {
          setRawJobRoles([]);
        }
      })
      .catch(err => {
        setRawJobRoles([]);
      });
  };

  const loadCountries = e => {
    CoreService.getCountries()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setCountries(res.data);
        } else {
          setCountries([]);
        }
      })
      .catch(err => {
        setCountries([]);
      });
  };

  const loadVisaStatuses = e => {
    CoreService.getVisaStatuses()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setVisaStatuses(res.data);
        } else {
          setVisaStatuses([]);
        }
      })
      .catch(err => {
        setVisaStatuses([]);
      });
  };

  const loadCareerLevels = e => {
    CoreService.getCareerLevels()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setCareerLevels(res.data);
        } else {
          setCareerLevels([]);
        }
      })
      .catch(err => {
        setCareerLevels([]);
      });
  };

  // const handleBack = e => {
  //   history.back();
  // };

  const handleSubmit = (values, {setSubmitting}) => {
    const params = {
      ...values,
    };
    dispatch(minifiedProfileActions.setValues(params));

    setSubmitting(false);
    !!onNext && onNext(2);
  };

  const formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {values, touched, errors, setFieldValue, setValues, setTouched, setErrors, handleChange, handleBlur, isSubmitting} = formikProps;

  useEffect(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
    loadJobRoles();
    loadCountries();
    loadVisaStatuses();
    loadCareerLevels();
  }, []);

  useMemo(e => {
    const items = [];
    for (let item of rawJobRoles) {
      items.push({
        value: item.id,
        text: item[`jobRole_${lang}`],
        lowercase: item[`jobRole_${lang}`].toLowerCase(),
      })
    }
    setJobRoles(items);
  }, [t, rawJobRoles]);

  const payload = () => (
    <Fragment>
      <form onSubmit={formikProps.handleSubmit}>
        <h3 className="h3-responsive mt-3 text-left">{t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.STEPS.JOB_KIND")}</h3>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            <label>{t("WORK.ACCOUNT.FIELDS.JOB_TITLE")}</label>
            <MDBInput id="jobTitle" name="jobTitle" outline
                      containerClass="my-0" value={values.jobTitle} onChange={handleChange} onBlur={handleBlur}>
              {!!touched.jobTitle && !!errors.jobTitle && <div className="text-left invalid-field">{errors.jobTitle}</div>}
            </MDBInput>
          </MDBCol>
          <MDBCol md="6" className="mt-3 text-left">
            {!!jobRoles.length && <Fragment>
              <label>{t("WORK.ACCOUNT.FIELDS.JOB_ROLE")}</label>
              <input hidden id="jobRoleId" value={values.jobRoleId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.jobRoleId}
                         getValue={val => {
                           helpers.triggerChangeEvent("jobRoleId", val[0])
                         }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} outline
                            value={jobRoleSearch} getValue={setJobRoleSearch} autoComplete="auto"/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {jobRoles.filter(item => item.lowercase.indexOf(debouncedJobRoleSearch) !== -1).map((item, index) => (
                    <MDBSelectOption key={index} value={item.value}
                                     checked={values.jobRoleId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.jobRoleId && !!errors.jobRoleId &&
              <div className="text-left invalid-field">{errors.jobRoleId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            {!!countries.length && <Fragment>
              <label>{t("WORK.ACCOUNT.FIELDS.JOB_LOCATION")}</label>
              <input hidden id="jobLocationId" value={values.jobLocationId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.jobLocationId}
                         getValue={val => {
                           helpers.triggerChangeEvent("jobLocationId", val[0])
                         }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {countries.map((item, index) => (
                    <MDBSelectOption key={index} value={item.id}
                                     checked={values.jobLocationId == item.id}>{item[`country_${lang}`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.jobLocationId && !!errors.jobLocationId &&
              <div className="text-left invalid-field">{errors.jobLocationId}</div>}
            </Fragment>}
          </MDBCol>
          <MDBCol md="6" className="mt-3 text-left">
            {!!visaStatuses.length && <Fragment>
              <label>{t("WORK.ACCOUNT.FIELDS.JOB_VISA_STATUS")}</label>
              <input hidden id="jobVisaStatusId" value={values.jobVisaStatusId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.jobVisaStatusId}
                         getValue={val => {
                           helpers.triggerChangeEvent("jobVisaStatusId", val[0])
                         }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {visaStatuses.map((item, index) => (
                    <MDBSelectOption key={index} value={item.id}
                                     checked={values.jobVisaStatusId == item.id}>{item[`visaStatus_${lang}`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.jobVisaStatusId && !!errors.jobVisaStatusId &&
              <div className="text-left invalid-field">{errors.jobVisaStatusId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            {!!careerLevels.length && <Fragment>
              <label>{t("WORK.ACCOUNT.FIELDS.CAREER_LEVEL")}</label>
              <input hidden id="careerLevel" value={values.careerLevel} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.careerLevel}
                         getValue={val => {
                           helpers.triggerChangeEvent("careerLevel", val[0])
                         }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {careerLevels.map((item, index) => (
                    <MDBSelectOption key={index} value={item.level}
                                     checked={values.careerLevel == item.level}>{item[`careerLevel_${lang}`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.careerLevel && !!errors.careerLevel &&
              <div className="text-left invalid-field">{errors.careerLevel}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <div className="mt-4 mb-3 text-right">
          <MDBBtn type="button" color="warning" size="sm" rounded disabled={!!isSubmitting}
                  onClick={onPrev}>{t("COMMON.BUTTON.BACK")}</MDBBtn>
          <MDBBtn type="submit" color="primary" size="sm" rounded
                  disabled={!!isSubmitting}>{t("COMMON.BUTTON.NEXT")}</MDBBtn>
        </div>
      </form>
    </Fragment>
  );

  return payload();
};
