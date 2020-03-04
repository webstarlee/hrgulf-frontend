import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBBtn, MDBCol, MDBInput, MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions} from "mdbreact";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";

import {DELAY, RESULT} from "core/globals";
import helpers from "core/helpers";
import useDebounce from "helpers/useDebounce";
import myJobsAction from "actions/my-jobs";
import CoreService from "services/CoreService";

import "./CandidateRequirements.scss";

export default ({onPrev, onNext}) => {
  const {t} = useTranslation();
  const {myJobs: {postAJob: {candidateRequirements}}} = useSelector(state => state);
  const dispatch = useDispatch();

  const [careerLevels, setCareerLevels] = useState([]);
  const [rawMajors, setRawMajors] = useState([]);
  const [majors, setMajors] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [countries, setCountries] = useState([]);
  const [rawCities, setRawCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [years, setYears] = useState([]);
  const [ages, setAges] = useState([]);

  const [majorSearch, setMajorSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const debouncedMajorSearch = useDebounce(majorSearch.toLowerCase(), DELAY.DELAY2);
  const debouncedCitySearch = useDebounce(citySearch.toLowerCase(), DELAY.DELAY2);

  const lang = t("CODE");

  const initialValues = candidateRequirements || {
    careerLevel: "0",
    xpYear1: "0",
    xpYear2: "0",
    majorId: "0",
    degree: "0",
    countryId: "0",
    cityId: "0",
    nationalityId: "0",
    gender: "U",
    age1: "0",
    age2: "0",
    majorSearch: "",
  };

  const validationSchema = Yup.object().shape({
    careerLevel: Yup.number()
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.CAREER_LEVEL")})),
    // xpYear1: Yup.number()
    //   .min(0, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.ROLE")})),
    xpYear2: Yup.number()
      .test("xpYear2-min", t("COMMON.VALIDATION.GREATER_THAN", {field: t("COMMON.FIELDS.MIN")}), function (value) {
        console.log(value, this.parent.xpYear1);
        return value >= this.parent.xpYear1;
      }),
    age2: Yup.number()
      .test("age2-min", t("COMMON.VALIDATION.GREATER_THAN", {field: t("COMMON.FIELDS.MIN")}), function (value) {
        return value >= this.parent.age1;
      }),
  });

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

  const loadMajors = e => {
    CoreService.getMajors({countryId: formikProps.values.countryId})
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

  const handleSubmit = (values, {setSubmitting}) => {
    const params = {
      ...values,
    };

    dispatch(myJobsAction.postAJob.setCandidateRequirements(params));;
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
    loadCareerLevels();
    loadCountries();
    loadMajors();
    loadDegrees();

    let items = [];
    for (let i = 0; i < 21; i++) {
      items.push(i);
    }
    setYears(items);

    items = [];
    for (let i = 18; i < 66; i++) {
      items.push(i);
    }
    setAges(items);
  }, []);

  useMemo(e => {
    !!countries.length && loadCities();
  }, [countries.length, values.countryId]);

  useMemo(e => {
    !!cities.length && formikProps.setFieldValue("cityId", "0");
  }, [values.countryId]);

  useMemo(e => {
    const items = [];
    for (let item of rawMajors) {
      items.push({
        value: item.id,
        text: item[`major_${lang}`],
        lowercase: item[`major_${lang}`].toLowerCase(),
      });
    }
    setMajors(items);
  }, [t, rawMajors]);

  useMemo(e => {
    const items = [];
    for (let item of rawCities) {
      items.push({
        value: item.id,
        text: item[`city_${lang}`],
        lowercase: item[`city_${lang}`].toLowerCase(),
      });
    }
    setCities(items);
  }, [t, rawCities]);

  const payload = () => (
    <Fragment>
      <form onSubmit={formikProps.handleSubmit}>
        <h3 className="h3-responsive mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.STEPS.CANDIDATE_REQUIREMENTS")}</h3>
        <h4 className="h4-responsive mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.EXPERIENCE")}</h4>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.CAREER_LEVEL")}</MDBCol>
          <MDBCol md="6">
            <input hidden id="careerLevel" value={values.careerLevel} onChange={handleChange} onBlur={handleBlur}/>
            {!!careerLevels.length && <MDBSelect className="my-0" outline search selected={values.careerLevel} getValue={val => {
              helpers.triggerChangeEvent("careerLevel", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
              <MDBSelectOptions className="max-height-200">
                <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                {careerLevels.map((item, index) => (
                  <MDBSelectOption key={index} value={item.level} checked={values.careerLevel == item.level}>{item[`careerLevel_${lang}`]}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.careerLevel && !!errors.careerLevel && <div className="text-left invalid-field">{errors.careerLevel}</div>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">
            <label>{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.YEAR_OF_EXPERIENCE")}</label>
          </MDBCol>
          <MDBCol md="6">
            <input hidden id="xpYear1" value={values.xpYear1} onChange={handleChange} onBlur={handleBlur}/>
            {!!years.length && <MDBSelect className="my-0" outline selected={values.xpYear1} getValue={val => {
              helpers.triggerChangeEvent("xpYear1", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.FIELDS.MIN")} />
              <MDBSelectOptions className="max-height-200">
                <MDBSelectOption disabled>{t("COMMON.FIELDS.MIN")}</MDBSelectOption>
                {years.map((item, index) => (
                  <MDBSelectOption key={index} value={item} checked={values.xpYear1 == item}>{item}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.xpYear1 && !!errors.xpYear1 && <div className="text-left invalid-field">{errors.xpYear1}</div>}
          </MDBCol>
          <MDBCol md="6">
            <input hidden id="xpYear2" value={values.xpYear1} onChange={handleChange} onBlur={handleBlur}/>
            {!!years.length && <MDBSelect className="my-0" outline selected={values.xpYear2} getValue={val => {
              helpers.triggerChangeEvent("xpYear2", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.FIELDS.MAX")} />
              <MDBSelectOptions className="max-height-200">
                <MDBSelectOption disabled>{t("COMMON.FIELDS.MAX")}</MDBSelectOption>
                {years.map((item, index) => (
                  <MDBSelectOption key={index} value={item} checked={values.xpYear2 == item}>{item}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.xpYear2 && !!errors.xpYear2 && <div className="text-left invalid-field">{errors.xpYear2}</div>}
          </MDBCol>
        </MDBRow>

        {/*{majors.map(item => (*/}
        {/*  <div>{item.text}, {values.majorSearch}, {item.text.match(values.majorSearch)}</div>))}*/}
        <h4 className="h4-responsive mt-5 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.EDUCATION")}</h4>
        <MDBRow className="mt-3 text-left">
          <MDBCol md="6">
            <label>{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.MAJOR")}</label>
            <input hidden id="majorId" value={values.majorId} onChange={handleChange} onBlur={handleBlur}/>
            {!!majors.length && <MDBSelect className="my-0" outline selected={values.majorId} getValue={val => {
              helpers.triggerChangeEvent("majorId", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
              <MDBSelectOptions className="max-height-200">
                <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} value={majorSearch} getValue={setMajorSearch}/>
                <MDBSelectOption value="0">{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                {majors.filter(item => item.lowercase.indexOf(debouncedMajorSearch) !== -1).map((item, index) => (
                  <MDBSelectOption key={index} value={item.value} checked={values.majorId == item.value}>{item.text}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.major && !!errors.major && <div className="text-left invalid-field">{errors.major}</div>}
            {/*<MDBInput id="major" name="major" outline*/}
            {/*          containerClass="my-0" className="my-0" value={values.title} onChange={handleChange} onBlur={handleBlur}>*/}
            {/*  {!!touched.major && !!errors.major && <div className="text-left invalid-field">{errors.major}</div>}*/}
            {/*</MDBInput>*/}
          </MDBCol>
          {!!degrees.length && <MDBCol md="6">
            <label>{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.DEGREE")}</label>
            <input hidden id="degree" value={values.degree} onChange={handleChange} onBlur={handleBlur}/>
            <MDBSelect className="my-0" outline search selected={values.degree} getValue={val => {
              helpers.triggerChangeEvent("degree", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
              <MDBSelectOptions className="max-height-200">
                <MDBSelectOption value="0">{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                {degrees.map((item, index) => (
                  <MDBSelectOption key={index} value={item.level} checked={values.degree == item.level}>{item[`degree_${lang}`]}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>
            {!!touched.degree && !!errors.degree && <div className="text-left invalid-field">{errors.degree}</div>}
          </MDBCol>}
        </MDBRow>

        <h4 className="h4-responsive mt-5 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.PERSONAL_INFORMATION")}</h4>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.LOCATION")}</MDBCol>
          <MDBCol md="6">
            <input hidden id="countryId" value={values.countryId} onChange={handleChange} onBlur={handleBlur}/>
            {!!countries.length && <MDBSelect className="my-0" outline selected={values.countryId} getValue={val => {
              helpers.triggerChangeEvent("countryId", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
              <MDBSelectOptions className="max-height-200">
                <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                {countries.map((item, index) => (
                  <MDBSelectOption key={index} value={item.id} checked={values.countryId == item.id}>{item[`country_${lang}`]}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.countryId && !!errors.countryId && <div className="text-left invalid-field">{errors.countryId}</div>}
          </MDBCol>
          <MDBCol md="6">
            <input hidden id="cityId" value={values.cityId} onChange={handleChange} onBlur={handleBlur}/>
            {!!cities.length && <MDBSelect className="mt-2 mt-md-0 mb-0" outline selected={values.cityId} getValue={val => {
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
            </MDBSelect>}
            {!!touched.cityId && !!errors.cityId && <div className="text-left invalid-field">{errors.cityId}</div>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.NATIONALITY")}</MDBCol>
          <MDBCol md="6">
            <input hidden id="nationalityId" value={values.nationalityId} onChange={handleChange} onBlur={handleBlur}/>
            {!!countries.length && <MDBSelect className="my-0" outline selected={values.nationalityId} getValue={val => {
              helpers.triggerChangeEvent("nationalityId", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
              <MDBSelectOptions>
                <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                {countries.map((item, index) => (
                  <MDBSelectOption key={index} value={item.id} checked={values.nationalityId == item.id}>{item[`country_${lang}`]}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.nationalityId && !!errors.nationalityId && <div className="text-left invalid-field">{errors.nationalityId}</div>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="mt-3 text-left">
            <label>{t("HIRE.MY_JOBS.POST_A_JOB.FIELDS.CANDIDATE_REQUIREMENTS.AGE")}</label>
          </MDBCol>
          <MDBCol md="6">
            <input hidden id="age1" value={values.age1} onChange={handleChange} onBlur={handleBlur}/>
            {!!ages.length && <MDBSelect className="my-0" outline selected={values.age1} getValue={val => {
              helpers.triggerChangeEvent("age1", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.FIELDS.MIN")} />
              <MDBSelectOptions className="max-height-200">
                <MDBSelectOption disabled>{t("COMMON.FIELDS.MIN")}</MDBSelectOption>
                {ages.map((item, index) => (
                  <MDBSelectOption key={index} value={item} checked={values.age1 == item}>{item}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.age1 && !!errors.age1 && <div className="text-left invalid-field">{errors.age1}</div>}
          </MDBCol>
          <MDBCol md="6">
            <input hidden id="age2" value={values.age2} onChange={handleChange} onBlur={handleBlur}/>
            {!!ages.length && <MDBSelect className="my-0" outline selected={values.age2} getValue={val => {
              helpers.triggerChangeEvent("age2", val[0])
            }}>
              <MDBSelectInput selected={t("COMMON.FIELDS.MAX")} />
              <MDBSelectOptions className="max-height-200">
                <MDBSelectOption disabled>{t("COMMON.FIELDS.MAX")}</MDBSelectOption>
                {ages.map((item, index) => (
                  <MDBSelectOption key={index} value={item} checked={values.age2 == item}>{item}</MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>}
            {!!touched.age2 && !!errors.age2 && <div className="text-left invalid-field">{errors.age2}</div>}
          </MDBCol>
        </MDBRow>

        <div className="mt-4 mb-3 text-right">
          <MDBBtn type="button" color="warning" size="sm" rounded onClick={onPrev} disabled={!!isSubmitting}>{t("COMMON.BUTTON.BACK")}</MDBBtn>
          <MDBBtn type="submit" color="primary" size="sm" rounded disabled={!!isSubmitting}>{t("COMMON.BUTTON.NEXT")}</MDBBtn>
        </div>
      </form>
    </Fragment>
  );

  return payload();
};
