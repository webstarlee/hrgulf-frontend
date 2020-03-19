import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  MDBBtn,
  MDBCol,
  MDBDatePicker,
  MDBInput,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions
} from "mdbreact";
import {useFormik} from "formik";
import {useHistory} from "react-router-dom";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {animateScroll as scroll} from "react-scroll";

import {DATE_FORMAT, DELAY, EFFECT, RESULT} from "core/globals";
import helpers from "core/helpers";
import minifiedProfileActions from "actions/minified-profile";
import useDebounce from "helpers/useDebounce";
import CoreService from "services/CoreService";

import "./Education.scss";

export default ({onPrev, onNext}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {work}, minifiedProfile} = useSelector(state => state);
  const dispatch = useDispatch();

  const [degrees, setDegrees] = useState([]);
  const [rawMajors, setRawMajors] = useState([]);
  const [majors, setMajors] = useState([]);
  const [grades, setGrades] = useState([]);

  const [majorSearch, setMajorSearch] = useState("");

  const debouncedMajorSearch = useDebounce(majorSearch, DELAY.DELAY2);

  const lang = t("CODE");

  const initialValues = minifiedProfile || {
    degree: "",
    university: "",
    majorId: 5,
    graduatedDate: new Date().toDateString(),
    gradeId: 1,
  };

  const validationSchema = Yup.object().shape({
    degree: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.DEGREE")})),
    university: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.UNIVERSITY")})),
    majorId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.MAJOR")})),
    graduatedDate: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.GRADUATED_DATE")})),
    gradeId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.GRADE")})),
  });

  const loadDegrees = e => {
    CoreService.getDegrees()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setDegrees(res.data);
        } else {
          setDegrees([]);
        }
      })
      .catch(err => {
        setDegrees([]);
      });
  };

  const loadMajors = e => {
    CoreService.getMajors()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setRawMajors(res.data);
        } else {
          setRawMajors([]);
        }
      })
      .catch(err => {
        setRawMajors([]);
      });
  };

  const loadGrades = e => {
    CoreService.getGrades()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setGrades(res.data);
        } else {
          setGrades([]);
        }
      })
      .catch(err => {
        setGrades([]);
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
    loadDegrees();
    loadMajors();
    loadGrades();
  }, []);

  useMemo(e => {
    const items = [];
    for (let item of rawMajors) {
      items.push({
        value: item.id,
        text: item[`major_${lang}`],
        lowercase: item[`major_${lang}`].toLowerCase(),
      })
    }
    setMajors(items);
  }, [t, rawMajors]);

  const payload = () => (
    <Fragment>
      <form onSubmit={formikProps.handleSubmit}>
        <h3 className="h3-responsive mt-3 text-left">{t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.STEPS.EDUCATION")}</h3>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            {!!degrees.length && <Fragment>
              <label>{t("WORK.ACCOUNT.FIELDS.DEGREE")}</label>
              <input hidden id="degree" value={values.degree} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.degree}
                         getValue={val => {
                           helpers.triggerChangeEvent("degree", val[0])
                         }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {degrees.map((item, index) => (
                    <MDBSelectOption key={index} value={item.degree}
                                     checked={values.degree == item.degree}>{item[`degree_${lang}`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.degree && !!errors.degree &&
              <div className="text-left invalid-field">{errors.degree}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            <label>{t("WORK.ACCOUNT.FIELDS.UNIVERSITY")}</label>
            <MDBInput id="university" name="university" outline
                      containerClass="my-0" value={values.university} onChange={handleChange} onBlur={handleBlur}>
              {!!touched.university && !!errors.university && <div className="text-left invalid-field">{errors.university}</div>}
            </MDBInput>
          </MDBCol>
          <MDBCol md="6" className="mt-3 text-left">
            {!!majors.length && <Fragment>
              <label>{t("WORK.ACCOUNT.FIELDS.MAJOR")}</label>
              <input hidden id="majorId" value={values.majorId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.majorId}
                         getValue={val => {
                           helpers.triggerChangeEvent("majorId", val[0])
                         }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} outline
                            value={majorSearch} getValue={setMajorSearch} autoComplete="auto"/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {majors.filter(item => item.lowercase.indexOf(debouncedMajorSearch) !== -1).map((item, index) => (
                    <MDBSelectOption key={index} value={item.value}
                                     checked={values.majorId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.majorId && !!errors.majorId &&
              <div className="text-left invalid-field">{errors.majorId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            <label>{t("WORK.ACCOUNT.FIELDS.GRADUATED_DATE")}</label>
            <input hidden id="graduatedDate" value={values.graduatedDate} onChange={handleChange} onBlur={handleBlur}/>
            <MDBDatePicker format={DATE_FORMAT.ISO} outline autoOk keyboard /*locale={moment.locale(t("CODE"))}*/ background className="md-outline date-picker grey-text mt-0 mb-0" value={values.graduatedDate} getValue={value => helpers.triggerChangeEvent("graduatedDate", value)}
            />
            {!!touched.graduatedDate && !!errors.graduatedDate && <div className="text-left invalid-field">{errors.graduatedDate}</div>}
          </MDBCol>
          <MDBCol md="6" className="mt-3 text-left">
            {!!grades.length && <Fragment>
              <label>{t("WORK.ACCOUNT.FIELDS.GRADE")}</label>
              <input hidden id="gradeId" value={values.gradeId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.gradeId}
                         getValue={val => {
                           helpers.triggerChangeEvent("gradeId", val[0])
                         }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {grades.map((item, index) => (
                    <MDBSelectOption key={index} value={item.id}
                                     checked={values.gradeId == item.id}>{item[`grade_${lang}`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.gradeId && !!errors.gradeId &&
              <div className="text-left invalid-field">{errors.gradeId}</div>}
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
