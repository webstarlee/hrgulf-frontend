import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBDatePicker,
  MDBFormInline, MDBIcon,
  MDBInput,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions
} from "mdbreact";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import dateformat from "dateformat";

import {DATE_FORMAT, DELAY, GENDER, PROJECT, RESULT} from "core/globals";
import helpers from "core/helpers";
import apis from "core/apis";
import validators from "core/validators";
import authActions from "actions/auth";
import useDebounce from "helpers/useDebounce";
import toast from "components/MyToast";
import Service from "services/work/account/AccountService";
import CoreService from "services/CoreService";

import "./WorkInformation.scss";

export default ({jobRoles, countries, sectors, allIndustries, visaStatuses, careerLevels, degrees, majors, grades, jobRoles2, countries2, allCities2, sectors2, allIndustries2, visaStatuses2, careerLevels2, degrees2, majors2, grades2}) => {
  const {t} = useTranslation();
  const {auth} = useSelector(state => state);
  const {work} = auth;
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  // const [rawCities, setRawCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [rawIndustries, setRawIndustries] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [jobRoleSearch, setJobRoleSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [majorSearch, setMajorSearch] = useState("");

  const debouncedJobRoleSearch = useDebounce(jobRoleSearch.toLowerCase(), DELAY.DELAY2);
  const debouncedCitySearch = useDebounce(citySearch.toLowerCase(), DELAY.DELAY2);
  const debouncedSectorSearch = useDebounce(sectorSearch.toLowerCase(), DELAY.DELAY2);
  const debouncedIndustrySearch = useDebounce(industrySearch.toLowerCase(), DELAY.DELAY2);
  const debouncedMajorSearch = useDebounce(majorSearch.toLowerCase(), DELAY.DELAY2);

  const lang = t("CODE");

  const initialValues = {
    id: work.id,
    jobRoleId: work.jobRoleId,
    jobTitle: work.jobTitle,
    companyName: work.companyName,
    startDate: work.startDate.length ? new Date(work.startDate).toDateString() : new Date().toDateString(),
    endDate: work.endDate.length ? new Date(work.endDate).toDateString() : new Date().toDateString(),
    isPresent: work.isPresent,
    jobLocationId: work.jobLocationId,
    companySectorId: work.companySectorId,
    companyIndustryId: work.companyIndustryId,
    jobVisaStatusId: work.jobVisaStatusId,
    careerLevel: work.careerLevel,
    degree: work.degree,
    university: work.university,
    majorId: work.majorId,
    graduatedDate: work.graduatedDate.length ? new Date(work.graduatedDate).toDateString() : new Date().toDateString(),
    gradeId: work.gradeId,
  };

  const validationSchema = Yup.object().shape({
    jobRoleId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_ROLE")})),
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
    jobVisaStatusId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_VISA_STATUS")})),
    careerLevel: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.CAREER_LEVEL")})),
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

  const loadCities = e => {
    CoreService.getCities({countryId: formikProps.values.countryId})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setCities(res.data);
        } else {
          setCities([]);
        }
      })
      .catch(err => {
        setCities([]);
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

  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);
    Service.save({...values, startDate: dateformat(new Date(values.startDate), DATE_FORMAT.ISO2_LOWER), endDate: dateformat(new Date(values.endDate), DATE_FORMAT.ISO2_LOWER), graduatedDate: dateformat(new Date(values.graduatedDate), DATE_FORMAT.ISO2_LOWER), id: work.id})
      .then(res => {
        setSubmitting(false);
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          const data = {
            ...auth,
            work: {
              ...work,
              ...res.data.work,
            },
          };
          dispatch(authActions.successSignIn(data));
          sessionStorage.setItem(PROJECT.PERSIST_KEY, JSON.stringify(data));
          !!localStorage.getItem(PROJECT.PERSIST_KEY) && localStorage.setItem(PROJECT.PERSIST_KEY, JSON.stringify(data));
          setIsEditing(false);
        } else {
          toast.error(res.message);
        }
      })
      .catch(err => {
        setSubmitting(false);
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
      });
  };

  const formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {values, touched, errors, setFieldValue, setValues, setTouched, setErrors, handleChange, handleBlur, isSubmitting} = formikProps;

  useEffect(e => {
    // loadCountries();
  }, []);

  useMemo(e => {
    !!countries.length && loadCities();
  }, [countries.length, values.countryId]);

  useMemo(e => {
    !!sectors.length && loadIndustries();
  }, [sectors.length, values.companySectorId]);

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
    <MDBCard className="mt-4 position-relative">
      <MDBCardBody>
        <h4 className="h4-responsive text-left grey-text">{t("WORK.MY_CV.MY_CV.SECTIONS.JOB_SEEKER_PROFILE")}</h4>
        {!!isEditing && <form onSubmit={formikProps.handleSubmit} className="text-left">
        {/*<form onSubmit={formikProps.handleSubmit} className="mx-0 mx-lg-5 text-left">*/}
          <div className="mb-4">
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
                        <MDBSelectOption key={index} value={item.level}
                                         checked={values.degree == item.level}>{item[`degree_${lang}`]}</MDBSelectOption>
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
          </div>

          <div className="text-center mt-4 mb-3">
            <MDBBtn type="submit" color="primary" size="sm" rounded className="z-depth-1a"
                    disabled={!!isSubmitting}>
              {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
              {!isSubmitting && t("COMMON.BUTTON.SAVE")}
            </MDBBtn>
          </div>
        </form>}
        {!isEditing && <Fragment>
          <table border={0} className="ml-4 ml-md-5 mt-2 mt-md-3 grey-text">
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.JOB_TITLE")}</td>
              <td className="">{work.jobTitle}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.JOB_ROLE")}</td>
              {!!jobRoles2 && <td className="">{!!jobRoles2[work.jobRoleId] && jobRoles2[work.jobRoleId][`jobRole_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.COMPANY_NAME")}</td>
              <td className="">{work.companyName}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.START_DATE")}</td>
              <td className="">{work.startDate}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.END_DATE")}</td>
              {!work.isPresent && <td className="">{work.endDate}</td>}
              {work.isPresent && <td className="">{t("WORK.ACCOUNT.FIELDS.IS_PRESENT")}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.JOB_LOCATION")}</td>
              {!!countries2 && <td className="">{!!countries2[work.jobLocationId] && countries2[work.jobLocationId][`country_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.JOB_VISA_STATUS")}</td>
              {!!visaStatuses2 && <td className="">{!!visaStatuses2[work.jobVisaStatusId] && visaStatuses2[work.jobVisaStatusId][`visaStatus_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.COMPANY_SECTOR")}</td>
              {!!sectors2 && <td className="">{!!sectors2[work.companySectorId] && sectors2[work.companySectorId][`sector_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.COMPANY_INDUSTRY")}</td>
              {!!allIndustries2 && <td className="">{!!allIndustries2[work.companyIndustryId] && allIndustries2[work.companyIndustryId][`industry_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.CAREER_LEVEL")}</td>
              {!!careerLevels2 && <td className="">{!!careerLevels2[work.careerLevel] && careerLevels2[work.careerLevel][`careerLevel_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.DEGREE")}</td>
              {!!degrees2 && <td className="">{!!degrees2[work.degree] && degrees2[work.degree][`degree_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.UNIVERSITY")}</td>
              <td className="">{work.university}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.MAJOR")}</td>
              {!!majors2 && <td className="">{!!majors2[work.majorId] && majors2[work.majorId][`major_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.GRADUATED_DATE")}</td>
              <td className="">{work.graduatedDate}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("WORK.ACCOUNT.FIELDS.GRADE")}</td>
              {!!grades2 && <td className="">{!!grades2[work.gradeId] && grades2[work.gradeId][`grade_${lang}`]}</td>}
            </tr>
          </table>
          <div className="edit-button-wrapper">
            <MDBBtn tag="a" floating color="primary" size="sm" onClick={() => setIsEditing(true)}><MDBIcon icon="edit"/></MDBBtn>
          </div>
        </Fragment>}
      </MDBCardBody>
    </MDBCard>
  );

  return payload();
}
