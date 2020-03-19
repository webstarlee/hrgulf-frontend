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

import {DATE_FORMAT, DELAY, EFFECT, JOB, RESULT} from "core/globals";
import helpers from "core/helpers";
import minifiedProfileActions from "actions/minified-profile";
import useDebounce from "helpers/useDebounce";
import goToBack from "helpers/goToBack";
import CoreService from "services/CoreService";

import "./Position.scss";
import dateformat from "dateformat";

export default ({backLink, onNext}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {work}, minifiedProfile} = useSelector(state => state);
  const dispatch = useDispatch();

  const [countries, setCountries] = useState([]);
  const [rawSectors, setRawSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [rawIndustries, setRawIndustries] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [sectorSearch, setSectorSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");

  const debouncedSectorSearch = useDebounce(sectorSearch, DELAY.DELAY2);
  const debouncedIndustrySearch = useDebounce(industrySearch, DELAY.DELAY2);

  const lang = t("CODE");

  const initialValues = minifiedProfile || {
    jobTitle: "",
    companyName: "",
    startDate: new Date().toDateString(),
    endDate: new Date().toDateString(),
    isPresent: 0,
    jobLocationId: 0,
    companySectorId: 0,
    companyIndustryId: 0,
  };

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_TITLE")})),
    companyName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.COMPANY_NAME")})),
    startDate: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.START_DATE")})),
    endDate: Yup.string()
      .test(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.END_DATE")}), function (value) {
        return this.parent.isPresent || (!!value && !!value.length);
      }),
    jobLocationId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_LOCATION")})),
    companySectorId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.COMPANY_SECTOR")})),
    companyIndustryId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.COMPANY_INDUSTRY")})),
  });

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

  const loadSectors = e => {
    CoreService.getSectors()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setRawSectors(res.data);
        } else {
          setRawSectors([]);
        }
      })
      .catch(err => {
        setRawSectors([]);
      });
  };

  const loadIndustries = e => {
    CoreService.getIndustries({sectorId: formikProps.values.companySectorId})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setRawIndustries(res.data);
        } else {
          setRawIndustries([]);
        }
      })
      .catch(err => {
        setRawIndustries([]);
      });
  };

  // const handleBack = e => {
  //   history.back();
  // };

  const handleSubmit = (values, {setSubmitting}) => {
    const params = {
      ...values,
      startDate: dateformat(new Date(values.startDate), DATE_FORMAT.ISO2_LOWER),
      endDate: dateformat(new Date(values.endDate), DATE_FORMAT.ISO2_LOWER),
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
    loadCountries();
    loadSectors();
  }, []);

  useMemo(e => {
    !!sectors.length && loadIndustries();
  }, [sectors.length, values.companySectorId]);

  useMemo(e => {
    !!industries.length && formikProps.setFieldValue("companyIndustryId", "0");
  }, [values.companySectorId]);

  useMemo(e => {
    const items = [];
    for (let item of rawSectors) {
      items.push({
        value: item.id,
        text: item[`sector_${lang}`],
        lowercase: item[`sector_${lang}`].toLowerCase(),
      })
    }
    setSectors(items);
  }, [t, rawSectors]);

  useMemo(e => {
    const items = [];
    for (let item of rawIndustries) {
      items.push({
        value: item.id,
        text: item[`industry_${lang}`],
        lowercase: item[`industry_${lang}`].toLowerCase(),
      })
    }
    setIndustries(items);
  }, [t, rawIndustries]);

  const payload = () => (
    <Fragment>
      <form onSubmit={formikProps.handleSubmit}>
        <h3 className="h3-responsive mt-3 text-left">{t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.STEPS.POSITION")}</h3>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            {t("WORK.ACCOUNT.FIELDS.JOB_TITLE")}
            <MDBInput id="jobTitle" name="jobTitle" outline
                      containerClass="my-0" value={values.jobTitle} onChange={handleChange} onBlur={handleBlur}>
              {!!touched.jobTitle && !!errors.jobTitle && <div className="text-left invalid-field">{errors.jobTitle}</div>}
            </MDBInput>
          </MDBCol>
          <MDBCol md="6" className="mt-3 text-left">
            {t("WORK.ACCOUNT.FIELDS.COMPANY_NAME")}
            <MDBInput id="companyName" name="companyName" outline
                      containerClass="my-0" value={values.companyName} onChange={handleChange} onBlur={handleBlur}>
              {!!touched.companyName && !!errors.companyName && <div className="text-left invalid-field">{errors.companyName}</div>}
            </MDBInput>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="4">
            <label>{t("WORK.ACCOUNT.FIELDS.START_DATE")}</label>
            <input hidden id="startDate" value={values.startDate} onChange={handleChange} onBlur={handleBlur}/>
            <MDBDatePicker format={DATE_FORMAT.ISO} outline autoOk keyboard /*locale={moment.locale(t("CODE"))}*/ background className="md-outline date-picker grey-text mt-0 mb-0" value={values.startDate} getValue={value => helpers.triggerChangeEvent("startDate", value)}
            />
            {!!touched.startDate && !!errors.startDate && <div className="text-left invalid-field">{errors.startDate}</div>}
          </MDBCol>
          <MDBCol md="4">
            <label>{t("WORK.ACCOUNT.FIELDS.END_DATE")}</label>
            <input hidden id="endDate" value={values.endDate} onChange={handleChange} onBlur={handleBlur}/>
            <MDBDatePicker format={DATE_FORMAT.ISO} outline autoOk keyboard /*locale={moment.locale(t("CODE"))}*/ background className="md-outline date-picker grey-text mt-0 mb-0" value={values.endDate} getValue={value => helpers.triggerChangeEvent("endDate", value)}
            />
            {!!touched.endDate && !!errors.endDate && <div className="text-left invalid-field">{errors.endDate}</div>}
          </MDBCol>
          <MDBCol md="4">
            <div className="pt-3 pt-md-3">
              <MDBInput type="checkbox" id="isPresent" label={t("WORK.ACCOUNT.FIELDS.IS_PRESENT")} filled containerClass="mt-md-4" checked={values.isPresent} onChange={handleChange}/>
              {!!touched.isPresent && !!errors.isPresent && <div className="text-left invalid-field">{errors.isPresent}</div>}
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12"
                  className="mt-3 text-left">{t("WORK.ACCOUNT.FIELDS.JOB_LOCATION")}</MDBCol>
          <MDBCol md="6">
            {!!countries.length && <Fragment>
              <input hidden id="jobLocationId" value={values.jobLocationId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.jobLocationId} getValue={val => {
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
        </MDBRow>
        <MDBRow>
          <MDBCol md="12"
                  className="mt-3 text-left">{t("WORK.ACCOUNT.FIELDS.COMPANY_SECTOR_N_INDUSTRY")}</MDBCol>
          <MDBCol md="6">
            {!!sectors.length && <Fragment>
              <input hidden id="companySectorId" value={values.companySectorId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.companySectorId} getValue={val => {
                helpers.triggerChangeEvent("companySectorId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")}
                            value={sectorSearch} getValue={setSectorSearch} autoComplete="auto"/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {sectors.filter(item => item.lowercase.indexOf(debouncedSectorSearch) !== -1).map((item, index) => (
                    <MDBSelectOption key={index} value={item.value}
                                     checked={values.companySectorId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.companySectorId && !!errors.companySectorId &&
              <div className="text-left invalid-field">{errors.companySectorId}</div>}
            </Fragment>}
          </MDBCol>
          <MDBCol md="6">
            {!!industries.length && <Fragment>
              <input hidden id="companyIndustryId" value={values.companyIndustryId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="mt-2 mt-md-0 mb-0" outline selected={values.companyIndustryId} getValue={val => {
                helpers.triggerChangeEvent("companyIndustryId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")}
                            value={industrySearch} getValue={setIndustrySearch} autoComplete="auto"/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {industries.filter(item => item.lowercase.indexOf(debouncedIndustrySearch) !== -1).map((item, index) => (
                    <MDBSelectOption key={index} value={item.value}
                                     checked={values.companyIndustryId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.companyIndustryId && !!errors.companyIndustryId &&
              <div className="text-left invalid-field">{errors.companyIndustryId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <div className="mt-4 mb-3 text-right">
          <MDBBtn type="button" color="warning" size="sm" rounded disabled={!backLink}
                  onClick={goToBack}>{t("COMMON.BUTTON.BACK")}</MDBBtn>
          <MDBBtn type="submit" color="primary" size="sm" rounded
                  disabled={!!isSubmitting}>{t("COMMON.BUTTON.NEXT")}</MDBBtn>
        </div>
      </form>
    </Fragment>
  );

  return payload();
};
