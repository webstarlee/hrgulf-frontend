import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  MDBBtn,
  MDBCol,
  MDBDatePicker, MDBFormInline,
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
import PhoneInput, {isValidPhoneNumber, parsePhoneNumber} from "react-phone-number-input";

import apis from "core/apis";
import {DATE_FORMAT, DEFAULT, DELAY, EFFECT, GENDER, PROJECT, RESULT} from "core/globals";
import helpers from "core/helpers";
import toast from "components/MyToast";
import useDebounce from "helpers/useDebounce";
import Service from "services/work/account/AccountService";
import CoreService from "services/CoreService";

import "react-phone-number-input/style.css";
import "./Contact.scss";
import routes from "core/routes";
import authActions from "actions/auth";

export default ({onPrev, onNext}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth, minifiedProfile} = useSelector(state => state);
  const {user, work} = auth;
  const dispatch = useDispatch();

  const [countries, setCountries] = useState([]);
  const [rawCities, setRawCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [visaStatuses, setVisaStatuses] = useState([]);
  const [grades, setGrades] = useState([]);

  const [citySearch, setCitySearch] = useState("");

  const debouncedCitySearch = useDebounce(citySearch, DELAY.DELAY2);

  const lang = t("CODE");

  const initialValues = minifiedProfile || {
    birthday: new Date().toDateString(),
    gender: "U",
    nationalityId: 5,
    countryId: 5,
    cityId: 181,
    visaStatusId: 1,
    phone: `${DEFAULT.USER.COUNTRY_CODE}${DEFAULT.USER.PHONE}`,
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
    phone: Yup.string()
      .test("phone-number", t("COMMON.VALIDATION.INVALID", {field: t("COMMON.FIELDS.USER.PHONE")}), isValidPhoneNumber),
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

  const handleSubmit = (values, {setSubmitting}) => {
    const mobile = parsePhoneNumber(values.phone);
    const params = {
      ...values,
      countryCode: `+${mobile.countryCallingCode}`,
      phone: mobile.nationalNumber,
      userId: user.id,
      id: user.workId,
    };

    setSubmitting(true);
    Service.saveMinifiedProfile(params)
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          const data = {
            ...auth,
            user: {
              ...user,
              ...res.data.user,
            },
            work: res.data.work,
            token: res.data.token,
          };
          dispatch(authActions.successSignIn(data));
          sessionStorage.setItem(PROJECT.PERSIST_KEY, JSON.stringify(data));
          !!localStorage.getItem(PROJECT.PERSIST_KEY) && localStorage.setItem(PROJECT.PERSIST_KEY, JSON.stringify(data));
          history.push(routes.work.root)
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
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
    loadCountries();
  }, []);

  useMemo(e => {
    !!countries.length && loadCities();
  }, [countries.length, values.countryId]);

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
        <h3 className="h3-responsive mt-3 text-left">{t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.STEPS.CONTACT")}</h3>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            <label>{t("COMMON.FIELDS.USER.BIRTHDAY")}</label>
            <input hidden id="birthday" value={values.birthday} onChange={handleChange} onBlur={handleBlur}/>
            <MDBDatePicker format={DATE_FORMAT.ISO} outline autoOk keyboard /*locale={moment.locale(t("CODE"))}*/ background className="md-outline date-picker grey-text mt-0 mb-0" value={values.birthday} getValue={value => helpers.triggerChangeEvent("birthday", value)}
            />
            {!!touched.birthday && !!errors.birthday && <div className="text-left invalid-field">{errors.birthday}</div>}
          </MDBCol>
          <MDBCol md="6" className="mt-3 text-left">
            <label>{t("COMMON.FIELDS.USER.GENDER")}</label>
            <MDBFormInline>
              <MDBInput
                checked={values.gender === GENDER.MALE}
                onClick={e => setFieldValue("gender", GENDER.MALE)}
                label={t("COMMON.GENDER.MALE")}
                type="radio"
                id="radMale"
                containerClass="mr-5"
              />
              <MDBInput
                checked={values.gender === GENDER.FEMALE}
                onClick={e => setFieldValue("gender", GENDER.FEMALE)}
                label={t("COMMON.GENDER.FEMALE")}
                type="radio"
                id="radFemale"
                containerClass="mr-5"
              />
              <MDBInput
                checked={values.gender === GENDER.UNDEFINED}
                onClick={e => setFieldValue("gender", GENDER.UNDEFINED)}
                label={t("COMMON.GENDER.UNDEFINED")}
                type="radio"
                id="radUndefined"
              />
            </MDBFormInline>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="6" className="mt-3 text-left">
            <input hidden id="phone" value={values.phone} onChange={handleChange} onBlur={handleBlur}/>
            <label>{t("COMMON.FIELDS.USER.PHONE")}</label>
            <PhoneInput
              className="md-form md-outline my-0"
              // placeholder={t("DRIVERS.FIELDS.MOBILE")}
              flagUrl={`${apis.assetsBaseUrl}${apis.assets.flags}/{XX}.png`}
              value={values.phone}
              onChange={value => helpers.triggerChangeEvent("phone", value)}/>
            {!!touched.phone && !!errors.phone && <div className="text-left invalid-field">{errors.phone}</div>}
          </MDBCol>
          <MDBCol md="6" className="mt-3 text-left">
            {!!countries.length && <Fragment>
              <label>{t("COMMON.FIELDS.USER.NATIONALITY")}</label>
              <input hidden id="nationalityId" value={values.nationalityId} onChange={handleChange} onBlur={handleBlur}/>
              <MDBSelect className="my-0" outline selected={values.nationalityId} getValue={val => {
                helpers.triggerChangeEvent("nationalityId", val[0])
              }}>
                <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")} />
                <MDBSelectOptions>
                  <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                  {countries.map((item, index) => (
                    <MDBSelectOption key={index} value={item.id} checked={values.nationalityId == item.id}>{item[`country_${lang}`]}</MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              {!!touched.nationalityId && !!errors.nationalityId && <div className="text-left invalid-field">{errors.nationalityId}</div>}
            </Fragment>}
          </MDBCol>
        </MDBRow>
        <MDBRow className="mt-3 text-left">
          <MDBCol md="12">
            <label>{t("COMMON.FIELDS.USER.LOCATION")}</label>
          </MDBCol>
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
                  <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")} value={citySearch} getValue={setCitySearch} autoComplete="auto"/>
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
