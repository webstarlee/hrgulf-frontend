import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBBtn, MDBCol, MDBInput, MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions} from "mdbreact";
import {useFormik} from "formik";
import {useHistory} from "react-router-dom";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {ContentState, convertFromHTML, convertToRaw, EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import {DELAY, JOB, RESULT, WYSIWYG} from "core/globals";
import helpers from "core/helpers";
import useDebounce from "helpers/useDebounce";
import goToBack from "helpers/goToBack";
import myJobsAction from "actions/my-jobs";
import CoreService from "services/CoreService";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./JobInformation.scss";

export default ({backLink, onNext}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {myJobs: {postAJob: {jobInformation}}} = useSelector(state => state);
  const dispatch = useDispatch();

  const [rawJobRoles, setRawJobRoles] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [rawJobSubroles, setRawJobSubroles] = useState([]);
  const [jobSubroles, setJobSubroles] = useState([]);
  const [rawSectors, setRawSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [rawIndustries, setRawIndustries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [rawCities, setRawCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [vacanciesCounts, setVacanciesCounts] = useState([]);

  const [jobRoleSearch, setJobRoleSearch] = useState("");
  const [jobSubroleSearch, setJobSubroleSearch] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const debouncedJobRoleSearch = useDebounce(jobRoleSearch, DELAY.DELAY2);
  const debouncedJobSubroleSearch = useDebounce(jobSubroleSearch, DELAY.DELAY2);
  const debouncedSectorSearch = useDebounce(sectorSearch, DELAY.DELAY2);
  const debouncedIndustrySearch = useDebounce(industrySearch, DELAY.DELAY2);
  const debouncedCitySearch = useDebounce(citySearch, DELAY.DELAY2);

  // const [candidateType, setCandidateType] = useState(JOB.CANDIDATE.TYPE.PROFESSIONAL);
  let initialDescription;
  if (!!jobInformation && !!jobInformation.description) {
    const blocksFromHtml = htmlToDraft(jobInformation.description);
    const {contentBlocks, entityMap} = blocksFromHtml;
    const state = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    );
    initialDescription = EditorState.createWithContent(
      state,
    );
  } else {
    initialDescription = EditorState.createEmpty();
  }

  let initialSkills;
  if (!!jobInformation && !!jobInformation.skills) {
    const blocksFromHtml = htmlToDraft(jobInformation.skills);
    const {contentBlocks, entityMap} = blocksFromHtml;
    const state = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    );
    initialSkills = EditorState.createWithContent(
      state,
    );
  } else {
    initialSkills = EditorState.createEmpty();
  }

  const [descEditorState, setDescEditorState] = useState(initialDescription);
  const [skillsEditorState, setSkillsEditorState] = useState(initialSkills);

  const lang = t("CODE");

  const initialValues = jobInformation || {
    candidateType: JOB.CANDIDATE.TYPE.PROFESSIONAL,
    title: "",
    jobRoleId: "0",
    jobSubroleId: "0",
    sectorId: "0",
    industryId: "0",
    countryId: "0",
    cityId: "0",
    employmentTypeId: "0",
    salaryRangeId: "0",
    vacanciesCount: "0",
    description: "",
    skills: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.TITLE")})),
    jobRoleId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.ROLE")})),
    jobSubroleId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.ROLE")})),
    sectorId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.SECTOR")})),
    industryId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.INDUSTRY")})),
    countryId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.COUNTRY")})),
    cityId: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.CITY")})),
    description: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.DESCRIPTION")})),
    skills: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.SKILLS")})),
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

  const loadJobSubroles = e => {
    CoreService.getJobSubroles({jobRoleId: formikProps.values.jobRoleId})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setRawJobSubroles(res.data);
        } else {
          setRawJobSubroles([]);
        }
      })
      .catch(err => {
        setRawJobSubroles([]);
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
    CoreService.getIndustries({sectorId: formikProps.values.sectorId})
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

  const loadCities = e => {
    CoreService.getCities({countryId: formikProps.values.countryId})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setRawCities(res.data);
        } else {
          setRawCities([]);
        }
      })
      .catch(err => {
        setRawCities([]);
      });
  };

  const loadEmploymentTypes = e => {
    CoreService.getEmploymentTypes()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setEmploymentTypes(res.data);
        } else {
          setEmploymentTypes([]);
        }
      })
      .catch(err => {
        setEmploymentTypes([]);
      });
  };

  const loadSalaryRanges = e => {
    CoreService.getSalaryRanges()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setSalaryRanges(res.data);
        } else {
          setSalaryRanges([]);
        }
      })
      .catch(err => {
        setSalaryRanges([]);
      });
  };

  // const handleBack = e => {
  //   history.back();
  // };

  const handleSubmit = (values, {setSubmitting}) => {
    const params = {
      ...values,
    };
    console.log("dispatch", params);
    dispatch(myJobsAction.postAJob.setJobInformation(params));;
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
    loadJobRoles();
    loadSectors();
    loadCountries();
    loadEmploymentTypes();
    loadSalaryRanges();

    let items = [];
    for (let i = 0; i < 101; i++) {
      items.push(i);
    }
    setVacanciesCounts(items);
  }, []);

  useMemo(e => {
    !!jobRoles.length && loadJobSubroles();
  }, [jobRoles.length, values.jobRoleId]);

  useMemo(e => {
    !!sectors.length && loadIndustries();
  }, [sectors.length, values.sectorId]);

  useMemo(e => {
    !!countries.length && loadCities();
  }, [countries.length, values.countryId]);

  useMemo(e => {
    !!jobSubroles.length && formikProps.setFieldValue("jobSubroleId", "0");
  }, [values.jobRoleId]);

  useMemo(e => {
    !!industries.length && formikProps.setFieldValue("industryId", "0");
  }, [values.sectorId]);

  useMemo(e => {
    !!cities.length && formikProps.setFieldValue("cityId", "0");
  }, [values.countryId]);

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

  useMemo(e => {
    const items = [];
    for (let item of rawJobSubroles) {
      items.push({
        value: item.id,
        text: item[`jobSubrole_${lang}`],
        lowercase: item[`jobSubrole_${lang}`].toLowerCase(),
      })
    }
    setJobSubroles(items);
  }, [t, rawJobSubroles]);

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

  useMemo(e => {
    const items = [];
    for (let item of rawCities) {
      items.push({
        value: item.id,
        text: item[`city_${lang}`],
        lowercase: item[`city_${lang}`].toLowerCase(),
      })
    }
    setCities(items);
  }, [t, rawCities]);

  const payload = () => (
    <Fragment>
      <form onSubmit={formikProps.handleSubmit}>
        <h3 className="h3-responsive mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.STEPS.JOB_INFORMATION")}</h3>
        <MDBRow>
          <MDBCol md="12" className="text-left mt-4">
            <label>{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.CANDIDATE_TYPE")}</label>
            <MDBInput type="radio" id="candidateType1" checked={values.candidateType === JOB.CANDIDATE.TYPE.PROFESSIONAL} onClick={e => setFieldValue("candidateType", JOB.CANDIDATE.TYPE.PROFESSIONAL)} label={t("HIRE.MY_JOBS.POST_A_JOB.CANDIDATE_TYPE.PROFESSIONAL")} />
            <MDBInput type="radio" id="candidateType2" checked={values.candidateType === JOB.CANDIDATE.TYPE.SKILLED} onClick={e => setFieldValue("candidateType", JOB.CANDIDATE.TYPE.SKILLED)} label={t("HIRE.MY_JOBS.POST_A_JOB.CANDIDATE_TYPE.SKILLED")} />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.TITLE")}</MDBCol>
          <MDBCol md="12">
            <MDBInput id="title" name="title" outline
                      containerClass="my-0" value={values.title} onChange={handleChange} onBlur={handleBlur}>
              {!!touched.title && !!errors.title && <div className="text-left invalid-field">{errors.title}</div>}
            </MDBInput>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.ROLE")}</MDBCol>
          <MDBCol md="6">
            {!!jobRoles.length && <Fragment>
              <input hidden id="jobRoleId" value={values.jobRoleId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline search searchLabel="Write here" selected={values.jobRoleId} getValue={val => {
                helpers.triggerChangeEvent("jobRoleId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} value={jobRoleSearch} getValue={setJobRoleSearch}/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {jobRoles.filter(item => item.lowercase.indexOf(debouncedJobRoleSearch) !== -1).map((item, index) => (
                    <MDBSelectOption key={index} value={item.value} checked={values.jobRoleId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.jobRoleId && !!errors.jobRoleId && <div className="text-left invalid-field">{errors.jobRoleId}</div>}
            </Fragment>}
          </MDBCol>
          <MDBCol md="6">
            {!!jobSubroles.length && <Fragment>
              <input hidden id="jobSubroleId" value={values.jobSubroleId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="mt-2 mt-md-0 mb-0" outline search selected={values.jobSubroleId} getValue={val => {
                helpers.triggerChangeEvent("jobSubroleId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} value={jobSubroleSearch} getValue={setJobSubroleSearch}/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {jobSubroles.filter(item => item.lowercase.indexOf(debouncedJobSubroleSearch) !== -1).map((item, index) => (
                      <MDBSelectOption key={index} value={item.value} checked={values.jobSubroleId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.jobSubroleId && !!errors.jobSubroleId && <div className="text-left invalid-field">{errors.jobSubroleId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.SECTOR_N_INDUSTRY")}</MDBCol>
          <MDBCol md="6">
            {!!sectors.length && <Fragment>
              <input hidden id="sectorId" value={values.sectorId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.sectorId} getValue={val => {
                helpers.triggerChangeEvent("sectorId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} value={sectorSearch} getValue={setSectorSearch}/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {sectors.filter(item => item.lowercase.indexOf(debouncedSectorSearch) !== -1).map((item, index) => (
                    <MDBSelectOption key={index} value={item.value} checked={values.sectorId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.sectorId && !!errors.sectorId && <div className="text-left invalid-field">{errors.sectorId}</div>}
            </Fragment>}
          </MDBCol>
          <MDBCol md="6">
            {!!industries.length && <Fragment>
              <input hidden id="industryId" value={values.industryId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="mt-2 mt-md-0 mb-0" outline selected={values.industryId} getValue={val => {
                helpers.triggerChangeEvent("industryId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} value={industrySearch} getValue={setIndustrySearch}/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {industries.filter(item => item.lowercase.indexOf(debouncedIndustrySearch) !== -1).map((item, index) => (
                    <MDBSelectOption key={index} value={item.value} checked={values.industryId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.industryId && !!errors.industryId && <div className="text-left invalid-field">{errors.industryId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.LOCATION")}</MDBCol>
          <MDBCol md="6">
            {!!countries.length && <Fragment>
              <input hidden id="countryId" value={values.countryId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.countryId} getValue={val => {
                helpers.triggerChangeEvent("countryId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {countries.map((item, index) => (
                    <MDBSelectOption key={index} value={item.id} checked={values.countryId == item.id}>{item[`country_${lang}`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.countryId && !!errors.countryId && <div className="text-left invalid-field">{errors.countryId}</div>}
            </Fragment>}
          </MDBCol>
          <MDBCol md="6">
            {!!cities.length && <Fragment>
              <input hidden id="cityId" value={values.cityId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="mt-2 mt-md-0 mb-0" outline selected={values.cityId} getValue={val => {
                helpers.triggerChangeEvent("cityId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} value={citySearch} getValue={setCitySearch}/>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {cities.filter(item => item.lowercase.indexOf(debouncedCitySearch) !== -1).map((item, index) => (
                    <MDBSelectOption key={index} value={item.value} checked={values.cityId == item.value}>{item.text}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.cityId && !!errors.cityId && <div className="text-left invalid-field">{errors.cityId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            {!!employmentTypes.length && <Fragment>
              <label>{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.EMPLOYMENT_TYPE")}</label>
              <input hidden id="employmentTypeId" value={values.employmentTypeId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.employmentTypeId} getValue={val => {
                helpers.triggerChangeEvent("employmentTypeId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption value="0">{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {employmentTypes.map((item, index) => (
                    <MDBSelectOption key={index} value={item.id} checked={values.employmentTypeId == item.id}>{item[`employmentType_${lang}`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.employmentTypeId && !!errors.employmentTypeId && <div className="text-left invalid-field">{errors.employmentTypeId}</div>}
            </Fragment>}
          </MDBCol>
          <MDBCol md="6" className="mt-3 text-left">
            {!!salaryRanges.length && <Fragment>
              <label>{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.SALARY_RANGE")}</label>
              <input hidden id="salaryRangeId" value={values.salaryRangeId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="mt-2 mt-md-0 mb-0" outline selected={values.salaryRangeId} getValue={val => {
                helpers.triggerChangeEvent("salaryRangeId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption value="0">{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {salaryRanges.map((item, index) => (
                    <MDBSelectOption key={index} value={item.id} checked={values.salaryRangeId == item.id}>${item[`minSalary`]} - ${item[`maxSalary`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.salaryRangeId && !!errors.salaryRangeId && <div className="text-left invalid-field">{errors.salaryRangeId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="6">
            {!!vacanciesCounts.length && <Fragment>
              <label>{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.VACANCIES_COUNT")}</label>
              <input hidden id="vacanciesCount" value={values.vacanciesCount} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.vacanciesCount} getValue={val => {
                helpers.triggerChangeEvent("vacanciesCount", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions className="max-height-200">
                  <MDBSelectOption value={-1}>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {vacanciesCounts.map((item, index) => (
                    <MDBSelectOption key={index} value={item} checked={values.vacanciesCount == item.id}>{item}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.vacanciesCount && !!errors.vacanciesCount && <div className="text-left invalid-field">{errors.vacanciesCount}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.DESCRIPTION")}</MDBCol>
          <MDBCol md="12" className="text-left">
            <Editor
              id="editor"
              toolbar={WYSIWYG.toolbar}
              editorState={descEditorState}
              wrapperClassName="description-wrapper"
              editorClassName="description-editor"
              onEditorStateChange={state => {
                setDescEditorState(state);
                setFieldValue("description", draftToHtml(convertToRaw(state.getCurrentContent())))
              }}
            />
            {!!touched.description && !!errors.description && <div className="text-left invalid-field">{errors.description}</div>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.JOB_INFORMATION.SKILLS")}</MDBCol>
          <MDBCol md="12" className="text-left">
            <Editor
              id="editor"
              toolbar={WYSIWYG.toolbar}
              editorState={skillsEditorState}
              wrapperClassName="skills-wrapper"
              editorClassName="skills-editor"
              onEditorStateChange={state => {
                setSkillsEditorState(state);
                setFieldValue("skills", draftToHtml(convertToRaw(state.getCurrentContent())))
              }}
            />
            {!!touched.skills && !!errors.skills && <div className="text-left invalid-field">{errors.skills}</div>}
          </MDBCol>
        </MDBRow>
        <div className="mt-4 mb-3 text-right">
          <MDBBtn type="button" color="warning" size="sm" rounded disabled={!backLink} onClick={goToBack}>{t("COMMON.BUTTON.BACK")}</MDBBtn>
          <MDBBtn type="submit" color="primary" size="sm" rounded disabled={!!isSubmitting}>{t("COMMON.BUTTON.NEXT")}</MDBBtn>
        </div>
      </form>
    </Fragment>
  );

  return payload();
};
