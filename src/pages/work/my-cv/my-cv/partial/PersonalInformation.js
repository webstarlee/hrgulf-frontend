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
import PhoneInput, {parsePhoneNumber} from "react-phone-number-input";
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
import Service from "services/AccountService";
import CoreService from "services/CoreService";

import "react-phone-number-input/style.css";
import "./PersonalInformation.scss";

export default ({countries, allCities, countries2, allCities2}) => {
  const {t} = useTranslation();
  const {auth} = useSelector(state => state);
  const {user} = auth;
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  // const [countries, setCountries] = useState([]);
  const [rawCities, setRawCities] = useState([]);
  const [cities, setCities] = useState([]);

  const [citySearch, setCitySearch] = useState("");

  const debouncedCitySearch = useDebounce(citySearch.toLowerCase(), DELAY.DELAY2);

  const lang = t("CODE");

  const initialValues = {
    firstName: user.firstName,
    fatherName: user.fatherName,
    lastName: user.lastName,
    nationalityId: user.nationalityId,
    countryId: user.countryId,
    cityId: user.cityId,
    birthday: user.birthday.length ? new Date(user.birthday).toDateString() : new Date().toDateString(),
    gender: user.gender,
    email: user.email,
    phone: `${user.countryCode}${user.phone}`,
    website: user.website,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.FIRST_NAME")})),
    fatherName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.FATHER_NAME")})),
    lastName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.LAST_NAME")})),
    nationalityId: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.NATIONALITY")}))
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.NATIONALITY")})),
    countryId: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.COUNTRY")}))
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.COUNTRY")})),
    cityId: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.CITY")}))
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.CITY")})),
    birthday: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.BIRTHDAY")})),
    email: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.EMAIL")}))
      .email(t("COMMON.VALIDATION.INVALID", {field: t("COMMON.FIELDS.USER.EMAIL")})),
    phone: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.PHONE")}))
      .test("phone-check", t("COMMON.VALIDATION.INVALID", {field: t("COMMON.FIELDS.USER.PHONE")}), validators.isPhoneNumber),
  });

  // const loadCountries = e => {
  //   CoreService.getCountries()
  //     .then(res => {
  //       if (res.result === RESULT.SUCCESS) {
  //         setCountries(res.data);
  //       } else {
  //         setCountries([]);
  //       }
  //     })
  //     .catch(err => {
  //       setCountries([]);
  //     });
  // };

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
    setSubmitting(true);
    Service.savePersonalInfo({...values, birthday: dateformat(new Date(values.birthday), DATE_FORMAT.ISO2_LOWER), countryCode: `+${mobile.countryCallingCode}`, phone: mobile.nationalNumber, id: user.id})
      .then(res => {
        setSubmitting(false);
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          const data = {
            ...auth,
            user: {
              ...user,
              ...res.data.user,
            },
            token: res.data.token,
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
    <MDBCard className="mt-4 position-relative">
      <MDBCardBody>
        <h4 className="h4-responsive text-left grey-text">{t("WORK.MY_CV.MY_CV.SECTIONS.PERSONAL_INFORMATION")}</h4>
        {!!isEditing && <form onSubmit={formikProps.handleSubmit} className="text-left">
        {/*<form onSubmit={formikProps.handleSubmit} className="mx-0 mx-lg-5 text-left">*/}
          <div className="mb-4">
            <MDBRow>
              <MDBCol md="6">
                <label>{t("COMMON.FIELDS.USER.FIRST_NAME")}</label>
                <MDBInput id="firstName" name="firstName" outline
                          containerClass="my-0" value={values.firstName} onChange={handleChange}
                          onBlur={handleBlur}>
                  {!!touched.firstName && !!errors.firstName && <div className="text-left invalid-field">{errors.firstName}</div>}
                </MDBInput>
              </MDBCol>
              <MDBCol md="6">
                <label>{t("COMMON.FIELDS.USER.FATHER_NAME")}</label>
                <MDBInput id="fatherName" name="fatherName" outline
                          containerClass="my-0" value={values.fatherName} onChange={handleChange}
                          onBlur={handleBlur}>
                  {!!touched.fatherName && !!errors.fatherName && <div className="text-left invalid-field">{errors.fatherName}</div>}
                </MDBInput>
              </MDBCol>
              <MDBCol md="6">
                <label>{t("COMMON.FIELDS.USER.LAST_NAME")}</label>
                <MDBInput id="lastName" name="lastName" outline
                          containerClass="my-0" value={values.lastName} onChange={handleChange}
                          onBlur={handleBlur}>
                  {!!touched.lastName && !!errors.lastName && <div className="text-left invalid-field">{errors.lastName}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-3 text-left">
              <MDBCol md="12">
                <label>{t("COMMON.FIELDS.USER.NATIONALITY")}</label>
              </MDBCol>
              <MDBCol md="6">
                {!!countries.length && <Fragment>
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
            <MDBRow className="mt-3 text-left">
              <MDBCol md="6">
                <label>{t("COMMON.FIELDS.USER.BIRTHDAY")}</label>
                <input hidden id="birthday" value={values.birthday} onChange={handleChange} onBlur={handleBlur}/>
                <MDBDatePicker format={DATE_FORMAT.ISO} outline autoOk keyboard /*locale={moment.locale(t("CODE"))}*/ background className="md-outline date-picker grey-text mt-0 mb-0" value={values.birthday} getValue={value => helpers.triggerChangeEvent("birthday", value)}
                />
                {!!touched.birthday && !!errors.birthday && <div className="text-left invalid-field">{errors.birthday}</div>}
              </MDBCol>
              <MDBCol md="6" className="mt-3 mt-md-0">
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
          </div>
          <div className="mt-3 mb-0">
            <h4 className="h4-responsive text-left grey-text">{t("HIRE.MY_ACCOUNT.PERSONAL_PROFILE.FIELDS.CONTACT_INFORMATION")}</h4>
            <MDBRow className="mt-3 text-left">
              <MDBCol md="6">
                <label>{t("COMMON.FIELDS.USER.EMAIL")}</label>
                <MDBInput id="email" name="email" type="email" outline
                          containerClass="my-0" value={values.email} onChange={handleChange}
                          onBlur={handleBlur}>
                  {!!touched.email && !!errors.email && <div className="text-left invalid-field">{errors.email}</div>}
                </MDBInput>
              </MDBCol>
              <MDBCol md="6">
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
            </MDBRow>
            <MDBRow>
              <MDBCol md="6">
                <label>{t("COMMON.FIELDS.USER.WEBSITE")}</label>
                <MDBInput id="website" name="website" outline
                          containerClass="my-0" value={values.website} onChange={handleChange}
                          onBlur={handleBlur}>
                  {!!touched.website && !!errors.website && <div className="text-left invalid-field">{errors.website}</div>}
                </MDBInput>
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
              <td className="pr-5">{t("COMMON.FIELDS.USER.FULL_NAME")}</td>
              <td className="">{user.firstName} {user.fatherName} {user.lastName}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("COMMON.FIELDS.USER.NATIONALITY")}</td>
              {!!countries2 && <td className="">{!!countries2[user.nationalityId] && countries2[user.nationalityId][`country_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("COMMON.FIELDS.USER.LOCATION")}</td>
              {!!countries2 && <td className="">{!!countries2[user.countryId] && countries2[user.countryId][`country_${lang}`]}</td>}
            </tr>
            <tr>
              <td className="pr-5">{t("COMMON.FIELDS.USER.BIRTHDAY")}</td>
              <td className="">{user.birthday}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("COMMON.FIELDS.USER.GENDER")}</td>
              <td className="">{t(`COMMON.GENDER.${user.gender}`)}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("COMMON.FIELDS.USER.EMAIL")}</td>
              <td className="">{user.email}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("COMMON.FIELDS.USER.PHONE")}</td>
              <td className="">{user.countryCode} {user.phone}</td>
            </tr>
            <tr>
              <td className="pr-5">{t("COMMON.FIELDS.USER.WEBSITE")}</td>
              <td className="">{user.website}</td>
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
