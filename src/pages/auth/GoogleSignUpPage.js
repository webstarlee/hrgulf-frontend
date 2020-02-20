import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  MDBAlert,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
  ToastContainer
} from "mdbreact";
import {useParams} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {Formik} from "formik";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import {Base64} from "js-base64";
import hash from "object-hash";
import {CSSTransition} from "react-transition-group";

import auth from "actions/auth";
import toast, {Fade} from "components/MyToast";
import helpers from "core/helpers";
import {AUTH, COUNTRY_CODE, DEFAULT, EFFECT, ERROR, PROJECT, RESULT, SOCIAL, VALIDATION} from "core/globals";
import validators from "core/validators";
import Service from "services/AuthService";
import images from "core/images";

import "./GoogleSignUpPage.scss";

export default (props) => {
  const dispatch = useDispatch();
  const {cipher, checksum} = useParams();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [IsInvalid, setIsInvalid] = useState(true);
  const [alert, setAlert] = useState({});

  const hash2 = hash(cipher);
  let googleId = "", email = "", firstName = "", lastName = "", id_token = "";
  if (hash2 === checksum) {
    const raw = Base64.decode(cipher.replace(/@/, "/"));
    const jsonParams = JSON.parse(raw);
    googleId = jsonParams.googleId;
    email = jsonParams.email;
    firstName = jsonParams.firstName;
    lastName = jsonParams.lastName;
    id_token = jsonParams.id_token;
  }

  const initialValues = {
    email: email,
    username: PROJECT.IS_DEV ? DEFAULT.USERNAME : "",
    firstName: firstName,
    fatherName: PROJECT.IS_DEV ? DEFAULT.FATHER_NAME : "",
    lastName: lastName,
    countryCode: PROJECT.IS_DEV ? COUNTRY_CODE.SAUDI_ARABIA : "",
    phone: PROJECT.IS_DEV ? DEFAULT.PHONE : "",
    password: "",
    password2: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.EMAIL")}))
      .email(t("COMMON.VALIDATION.INVALID", {field: t("AUTH.EMAIL")})),
    username: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.USERNAME")}))
      .max(AUTH.USERNAME_MAX_LENGTH, t("COMMON.VALIDATION.MAX_LENGTH", {
        field: t("AUTH.USERNAME"),
        length: t(`COMMON.CARDINALS.${AUTH.USERNAME_MAX_LENGTH}`)
      }))
      .test("isUsername", t("COMMON.VALIDATION.INVALID", {field: t("AUTH.USERNAME")}), validators.isUsername),
    firstName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FIRST_NAME")})),
    fatherName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FATHER_NAME")})),
    lastName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.LAST_NAME")})),
    countryCode: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.COUNTRY_CODE")})),
    phone: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PHONE")}))
      .test("isPhoneNumber", t("COMMON.VALIDATION.INVALID", {field: t("AUTH.PHONE")}), function (value) {
        return validators.isPhoneNumber(`${this.parent.countryCode}${value}`);
      }),
    password: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD")}))
      .min(AUTH.PASSWORD_MIN_LENGTH, t("COMMON.VALIDATION.MIN_LENGTH", {
        field: t("AUTH.PASSWORD"),
        length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)
      })),
    password2: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD2")}))
      .oneOf([Yup.ref("password"), null], t("COMMON.VALIDATION.MISMATCH", {field: t("AUTH.PASSWORD")})),
  });

  const validateAccount = () => {
    const hash2 = hash(cipher);
    if (hash2 !== checksum) {
      setIsInvalid(true);
      setAlert({
        show: true,
        color: "danger",
        message: t("AUTH.ERROR.ACCOUNT_IS_INVALID"),
      });
      return;
    }

    setLoading(true);

    const params = {googleId, email, firstName, lastName, id_token};
    Service.validateGoogleAccount(params)
      .then(res => {
        setLoading(false);
        if (res.result === RESULT.SUCCESS) {
          setIsInvalid(false);
        } else {
          setIsInvalid(true);
          setAlert({
            show: true,
            color: res.result,
            message: res.message,
          });
        }
      })
      .catch(err => {
        setLoading(false);
        setIsInvalid(true);
        setAlert({
          show: true,
          color: "danger",
          message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
        });
      });
  };

  const validate = ({email, username, firstName, fatherName, lastName, countryCode, phone, password, password2}) => {
    const errors = {};

    if (!email.length) {
      errors["email"] = VALIDATION.REQUIRED;
    } else if (!validators.isEmail(email)) {
      errors["email"] = VALIDATION.INVALID;
    }

    if (!username.length) {
      errors["username"] = VALIDATION.REQUIRED;
    } else if (!validators.isUsername(username)) {
      errors["username"] = VALIDATION.INVALID;
    } else if (username.length > AUTH.USERNAME_MAX_LENGTH) {
      errors["username"] = VALIDATION.MAX_LENGTH;
    }

    if (!firstName.length) {
      errors["firstName"] = VALIDATION.REQUIRED;
    }

    if (!fatherName.length) {
      errors["fatherName"] = VALIDATION.REQUIRED;
    }

    if (!lastName.length) {
      errors["lastName"] = VALIDATION.REQUIRED;
    }

    if (!countryCode.length) {
      errors["countryCode"] = VALIDATION.REQUIRED;
    }

    if (!phone.length) {
      errors["phone"] = VALIDATION.REQUIRED;
    } else if (!validators.isPhoneNumber(`${countryCode}${phone}`)) {
      errors["phone"] = VALIDATION.INVALID;
    }

    // if (!password.length) {
    //   errors["password"] = VALIDATION.REQUIRED;
    // } else if (password.length < AUTH.PASSWORD_MIN_LENGTH) {
    //   errors["password"] = VALIDATION.MIN_LENGTH;
    // }
    //
    // if (!password2.length) {
    //   errors["password2"] = VALIDATION.REQUIRED;
    // } else if (password2 !== password) {
    //   errors["password2"] = VALIDATION.MISMATCH;
    // }

    return errors;
  };

  const handleSubmit = (params, {setSubmitting}) => {
    params = {...params, social: SOCIAL.NAME.GOOGLE, socialId: googleId};
    dispatch(auth.requestSignUp(params));
    setSubmitting(true);
    Service.signUp(params)
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          dispatch(auth.successSignUp(res.data));
          toast.success(res.message);
          setSubmitting(false);
        } else {
          dispatch(auth.failureSignUp(res.message));
          toast.error(res.message);
          setSubmitting(false);
        }
      })
      .catch(err => {
        dispatch(auth.failureSignUp(ERROR.UNKNOWN_SERVER_ERROR));
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setSubmitting(false);
      })
  };

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });

    validateAccount();
  }, [props]);

  useMemo(e => {

  }, [t]);

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{t("AUTH.SIGN_UP_GOOGLE")} - {t("SITE_NAME")}</title>
      </Helmet>
      <div className="admin-nav text-center">
        <img className="logo-img mt-3 mb-5" src={images.logo.logo100}/>
      </div>
      <MDBCard className="auth-bg">
        <MDBCardBody className="mx-md-4 mx-sm-1">
          <MDBRow className="text-center">
            <MDBCol className="col-12 underlined white-border">
              <p className="text-white h5">{t("AUTH.SIGN_UP_GOOGLE")}</p>
            </MDBCol>
          </MDBRow>
          <Formik
            initialValues={initialValues}
            // validate={validate}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({values, errors, touched, handleChange, handleSubmit, handleBlur, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <input hidden id="countryCode" name="countryCode" onChange={handleChange} onBlur={handleBlur}/>
                <div className="white-text">
                  <MDBRow>
                    {/* <MDBCol md="6">
                      <MDBInput id="email" name="email" type="email" label={t("AUTH.EMAIL")} background readOnly
                                containerClass="mb-0" value={values.email} onChange={handleChange} onBlur={handleBlur}>
                        {!!touched.email && errors.email === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.EMAIL")})}</div>}
                        {!!touched.email && errors.email === VALIDATION.INVALID && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.INVALID", {field: t("AUTH.EMAIL")})}</div>}
                      </MDBInput>
                    </MDBCol> */}
                    <MDBCol md="6">
                      <MDBInput id="username" name="username" type="text" label={t("AUTH.USERNAME")} background
                                containerClass="mb-0" value={values.username} onChange={handleChange}
                                onBlur={handleBlur}>
                        {/*{!!touched.username && errors.username === VALIDATION.REQUIRED && <div*/}
                        {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.USERNAME")})}</div>}*/}
                        {/*{!!touched.username && errors.username === VALIDATION.INVALID && <div*/}
                        {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.INVALID", {field: t("AUTH.USERNAME")})}</div>}*/}
                        {/*{!!touched.username && errors.username === VALIDATION.MAX_LENGTH && <div*/}
                        {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.MAX_LENGTH", {*/}
                        {/*  field: t("AUTH.USERNAME"),*/}
                        {/*  length: t(`COMMON.CARDINALS.${AUTH.USERNAME_MAX_LENGTH}`)*/}
                        {/*})}</div>}*/}
                        {!!touched.username && !!errors.username && <div className="text-left invalid-field2">{errors.username}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="firstName" name="firstName" type="text" label={t("AUTH.FIRST_NAME")} background
                                containerClass="mb-0" value={values.firstName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {/*{!!touched.firstName && errors.firstName === VALIDATION.REQUIRED && <div*/}
                        {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FIRST_NAME")})}</div>}*/}
                        {!!touched.firstName && !!errors.firstName && <div className="text-left invalid-field2">{errors.firstName}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput id="fatherName" name="fatherName" type="text" label={t("AUTH.FATHER_NAME")} background
                                containerClass="mt-3 mb-0" value={values.fatherName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {/*{!!touched.fatherName && errors.fatherName === VALIDATION.REQUIRED && <div*/}
                        {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FATHER_NAME")})}</div>}*/}
                        {!!touched.fatherName && !!errors.fatherName && <div className="text-left invalid-field2">{errors.fatherName}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="lastName" name="lastName" type="text" label={t("AUTH.LAST_NAME")} background
                                containerClass="mt-3 mb-0" value={values.lastName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {/*{!!touched.lastName && errors.lastName === VALIDATION.REQUIRED && <div*/}
                        {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.LAST_NAME")})}</div>}*/}
                        {!!touched.lastName && !!errors.lastName && <div className="text-left invalid-field2">{errors.lastName}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6" className="mt-2">
                      <MDBSelect label={t("AUTH.COUNTRY_CODE")} className="mt-3 mb-0 white"
                                 selected={values.countryCode} getValue={val => {
                        helpers.triggerChangeEvent("countryCode", val[0])
                      }}>
                        <MDBSelectInput/>
                        <MDBSelectOptions>
                          <MDBSelectOption value={COUNTRY_CODE.BAHRAIN}
                                           checked={values.countryCode === COUNTRY_CODE.BAHRAIN}>{COUNTRY_CODE.BAHRAIN} - {t("COMMON.GCC_COUNTRIES.BAHRAIN")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY_CODE.KUWAIT}
                                           checked={values.countryCode === COUNTRY_CODE.KUWAIT}>{COUNTRY_CODE.KUWAIT} - {t("COMMON.GCC_COUNTRIES.KUWAIT")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY_CODE.OMAN}
                                           checked={values.countryCode === COUNTRY_CODE.OMAN}>{COUNTRY_CODE.OMAN} - {t("COMMON.GCC_COUNTRIES.OMAN")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY_CODE.QATAR}
                                           checked={values.countryCode === COUNTRY_CODE.QATAR}>{COUNTRY_CODE.QATAR} - {t("COMMON.GCC_COUNTRIES.QATAR")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY_CODE.SAUDI_ARABIA}
                                           checked={values.countryCode === COUNTRY_CODE.SAUDI_ARABIA}>{COUNTRY_CODE.SAUDI_ARABIA} - {t("COMMON.GCC_COUNTRIES.SAUDI_ARABIA")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY_CODE.UAE}
                                           checked={values.countryCode === COUNTRY_CODE.UAE}>{COUNTRY_CODE.UAE} - {t("COMMON.GCC_COUNTRIES.UAE")}</MDBSelectOption>
                        </MDBSelectOptions>
                      </MDBSelect>
                      {/*{errors.countryCode === VALIDATION.REQUIRED && <div*/}
                      {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.COUNTRY_CODE")})}</div>}*/}
                      {!!touched.countryCode && !!errors.countryCode && <div className="text-left invalid-field2">{errors.countryCode}</div>}
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="phone" name="phone" type="text" label={t("AUTH.PHONE")} background
                                containerClass="mt-3 mb-0" value={values.phone} onChange={handleChange}
                                onBlur={handleBlur}>
                        {/*{!!touched.phone && errors.phone === VALIDATION.REQUIRED && <div*/}
                        {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PHONE")})}</div>}*/}
                        {/*{errors.phone === VALIDATION.INVALID && <div*/}
                        {/*  className="text-left invalid-field2">{t("COMMON.VALIDATION.INVALID", {field: t("AUTH.PHONE")})}</div>}*/}
                        {!!errors.phone && <div className="text-left invalid-field2">{errors.phone}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  {/*<MDBRow>*/}
                  {/*  <MDBCol md="6">*/}
                  {/*    <MDBInput id="password" name="password" label={t("AUTH.PASSWORD")} type="password" background*/}
                  {/*              containerClass="mt-3" value={values.password} onChange={handleChange}*/}
                  {/*              onBlur={handleBlur}>*/}
                  {/*      {!!touched.password && errors.password === VALIDATION.REQUIRED && <div*/}
                  {/*        className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD")})}</div>}*/}
                  {/*      {!!touched.password && errors.password === VALIDATION.MIN_LENGTH && <div*/}
                  {/*        className="text-left invalid-field2">{t("COMMON.VALIDATION.MIN_LENGTH", {*/}
                  {/*        field: t("AUTH.PASSWORD"),*/}
                  {/*        length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)*/}
                  {/*      })}</div>}*/}
                  {/*    </MDBInput>*/}
                  {/*  </MDBCol>*/}
                  {/*  <MDBCol md="6">*/}
                  {/*    <MDBInput id="password2" name="password2" label={t("AUTH.PASSWORD2")} type="password" background*/}
                  {/*              containerClass="mt-3" value={values.password2} onChange={handleChange}*/}
                  {/*              onBlur={handleBlur}>*/}
                  {/*      {!!touched.password2 && errors.password2 === VALIDATION.REQUIRED && <div*/}
                  {/*        className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD2")})}</div>}*/}
                  {/*      {!!touched.password2 && errors.password2 === VALIDATION.MIN_LENGTH && <div*/}
                  {/*        className="text-left invalid-field2">{t("COMMON.VALIDATION.MIN_LENGTH", {*/}
                  {/*        field: t("AUTH.PASSWORD2"),*/}
                  {/*        length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)*/}
                  {/*      })}</div>}*/}
                  {/*      {(!!touched.password || !!touched.password2) && errors.password2 === VALIDATION.MISMATCH && <div*/}
                  {/*        className="text-left invalid-field2">{t("COMMON.VALIDATION.MISMATCH", {field: t("AUTH.PASSWORD")})}</div>}*/}
                  {/*    </MDBInput>*/}
                  {/*  </MDBCol>*/}
                  {/*</MDBRow>*/}
                </div>
                <CSSTransition in={alert.show} classNames="mt-3 fade-transition" timeout={EFFECT.TRANSITION_TIME}
                               unmountOnExit
                               appear>
                  <MDBAlert color={alert.color} onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
                </CSSTransition>
                <div className="text-center mt-4 mb-3 mx-5">
                  <MDBBtn type="submit" color="white" rounded className="full-width z-depth-1a blue-grey-text"
                          disabled={!!loading || !!IsInvalid || !!isSubmitting || (!!errors && !!Object.keys(errors).length)}>
                    {!isSubmitting && <MDBIcon size="lg" icon={"user-plus"}/>}
                    {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
                    {!isSubmitting && t("AUTH.SIGN_UP")}
                  </MDBBtn>
                </div>
              </form>
            )}
          </Formik>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer
        className="text-left"
        position={t("DIRECTION") === "ltr" ? "top-right" : "top-left"}
        dir={t("DIRECTION")}
        hideProgressBar={true}
        // newestOnTop={true}
        // autoClose={0}
        autoClose={EFFECT.TRANSITION_TIME5}
        closeButton={false}
        transition={Fade}/>
    </Fragment>
  );

  return payload();
};
