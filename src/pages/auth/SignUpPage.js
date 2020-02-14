import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {
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
  ToastContainer,
} from "mdbreact";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {Formik} from "formik";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import toast, {Fade} from "components/MyToast";
import {AUTH, COUNTRY_CODE, DEFAULT, EFFECT, ERROR, PROJECT, RESULT, VALIDATION,} from "core/globals";
import routes from "core/routes";
import validators from "core/validators";
import images from "core/images";
import Service from "services/AuthService";
import auth from "actions/auth";
import helpers from "core/helpers";

import "./SignUpPage.scss";

export default (props) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const history = useHistory();

  const initialValues = {
    email: PROJECT.IS_DEV ? DEFAULT.EMAIL : "",
    username: PROJECT.IS_DEV ? DEFAULT.USERNAME : "",
    firstName: PROJECT.IS_DEV ? DEFAULT.FIRST_NAME : "",
    fatherName: PROJECT.IS_DEV ? DEFAULT.FATHER_NAME : "",
    lastName: PROJECT.IS_DEV ? DEFAULT.LAST_NAME : "",
    countryCode: PROJECT.IS_DEV ? COUNTRY_CODE.SAUDI_ARABIA : "",
    phone: PROJECT.IS_DEV ? DEFAULT.PHONE : "",
    password: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
    password2: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
  };

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, [props]);

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

    if (!password.length) {
      errors["password"] = VALIDATION.REQUIRED;
    } else if (password.length < AUTH.PASSWORD_MIN_LENGTH) {
      errors["password"] = VALIDATION.MIN_LENGTH;
    }

    if (!password2.length) {
      errors["password2"] = VALIDATION.REQUIRED;
    } else if (password2 !== password) {
      errors["password2"] = VALIDATION.MISMATCH;
    }

    return errors;
  };

  const handleSubmit = async (params) => {
    params = {...params};
    try {
      dispatch(auth.requestSignUp(params));
      let res = await Service.signUp(params);
      if (res.result === RESULT.SUCCESS) {
        dispatch(auth.successSignUp(res.data));
        toast.success(res.message);
      } else {
        dispatch(auth.failureSignUp(res.message));
        toast.error(res.message);
      }

    } catch (err) {
      dispatch(auth.failureSignUp(ERROR.UNKNOWN_SERVER_ERROR));
      toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
    }
  };

  const callbackGoogleSuccess = e => {
    const {profileObj: {email, givenName, familyName}, tokenObj: {id_token}} = e;
    history.push(`${routes.auth.googleSignUp}/${email}/${givenName}/${familyName}/${id_token}`);
  };

  const callbackGoogleFailure = e => {

  };

  const callbackFacebook = e => {

  };

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{t("AUTH.SIGN_UP")} - {t("SITE_NAME")}</title>
      </Helmet>
      <div className="admin-nav text-right">
        {/*<MDBBtn href={routes.admin2} size="sm" rounded color="indigo">{t("COMMON.BUTTON.ADMIN_PAGE")}</MDBBtn>*/}
      </div>
      <div className="text-center">
        <img className="logo-img mt-3 mb-5" src={images.logo.logo100}/>
      </div>
      <MDBCard className="auth-bg">
        <MDBCardBody className="mx-md-4 mx-sm-1 mb-lg-5">
          <MDBRow className="text-center">
            <MDBCol className="col-6 col-lg-4">
              <Link to={routes.auth.signIn}><p className="text-white h5">{t("AUTH.SIGN_IN")}</p></Link>
            </MDBCol>
            <MDBCol className="col-6 col-lg-4 underlined white-border">
              <p className="text-white h5">{t("AUTH.SIGN_UP")}</p>
            </MDBCol>
          </MDBRow>
          <div className="mt-3 mt-lg-5 mb-2 mb-lg-3 mx-lg-5">
            <div className="text-center">
              <FacebookLogin
                appId={AUTH.FACEBOOK.APP_ID}
                autoLoad
                callback={callbackFacebook}
                render={({isDisabled, isProcessing, isSdkLoaded, onClick}) => (
                  <MDBBtn social="fb" rounded className="full-width z-depth-1a mx-0" onClick={onClick} disabled={isDisabled || isProcessing || !isSdkLoaded}>
                    <MDBIcon fab icon="facebook" size="lg"
                    className="pr-1"/>
                    {t("AUTH.SIGN_UP_FACEBOOK")}
                  </MDBBtn>
                )}
              />

            </div>
            <div className="text-center">
              <GoogleLogin
                clientId={AUTH.GOOGLE.CLIENT_ID}
                onSuccess={callbackGoogleSuccess}
                onFailure={callbackGoogleFailure}
                // uxMode="redirect"
                // redirectUri={AUTH.GOOGLE.REDIRECT_URI.SIGN_UP}
                cookiePolicy={"single_host_origin"}
                render={({disabled, onClick}) => (
                  <MDBBtn social="gplus" rounded className="full-width z-depth-1a mx-0" onClick={onClick}
                          disabled={disabled}>
                    <MDBIcon fab icon="google-plus-g" size="lg"
                             className="pr-1"/> {t("AUTH.SIGN_UP_GOOGLE")}
                  </MDBBtn>
                )}
              />
            </div>
          </div>
          <hr className="white-border"/>
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <input hidden id="countryCode" name="countryCode" onChange={handleChange} onBlur={handleBlur}/>
                <div className="white-text">
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput id="email" name="email" type="email" label={t("AUTH.EMAIL")} background
                                containerClass="mb-0" value={values.email} onChange={handleChange} onBlur={handleBlur}>
                        {!!touched.email && errors.email === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.EMAIL")})}</div>}
                        {!!touched.email && errors.email === VALIDATION.INVALID && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.INVALID", {field: t("AUTH.EMAIL")})}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="username" name="username" type="text" label={t("AUTH.USERNAME")} background
                                containerClass="mb-0" value={values.username} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.username && errors.username === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.USERNAME")})}</div>}
                        {!!touched.username && errors.username === VALIDATION.INVALID && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.INVALID", {field: t("AUTH.USERNAME")})}</div>}
                        {!!touched.username && errors.username === VALIDATION.MAX_LENGTH && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.MAX_LENGTH", {
                          field: t("AUTH.USERNAME"),
                          length: t(`COMMON.CARDINALS.${AUTH.USERNAME_MAX_LENGTH}`)
                        })}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput id="firstName" name="firstName" type="text" label={t("AUTH.FIRST_NAME")} background
                                containerClass="mt-3 mb-0" value={values.firstName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.firstName && errors.firstName === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FIRST_NAME")})}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="fatherName" name="fatherName" type="text" label={t("AUTH.FATHER_NAME")} background
                                containerClass="mt-3 mb-0" value={values.fatherName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.fatherName && errors.fatherName === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FATHER_NAME")})}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="lastName" name="lastName" type="text" label={t("AUTH.LAST_NAME")} background
                                containerClass="mt-3 mb-0" value={values.lastName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.lastName && errors.lastName === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.LAST_NAME")})}</div>}
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
                      {errors.countryCode === VALIDATION.REQUIRED && <div
                        className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.COUNTRY_CODE")})}</div>}
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="phone" name="phone" type="text" label={t("AUTH.PHONE")} background
                                containerClass="mt-3 mb-0" value={values.phone} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.phone && errors.phone === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PHONE")})}</div>}
                        {errors.phone === VALIDATION.INVALID && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.INVALID", {field: t("AUTH.PHONE")})}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput id="password" name="password" label={t("AUTH.PASSWORD")} type="password" background
                                containerClass="mt-3" value={values.password} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.password && errors.password === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD")})}</div>}
                        {!!touched.password && errors.password === VALIDATION.MIN_LENGTH && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.MIN_LENGTH", {
                          field: t("AUTH.PASSWORD"),
                          length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)
                        })}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="password2" name="password2" label={t("AUTH.PASSWORD2")} type="password" background
                                containerClass="mt-3" value={values.password2} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.password2 && errors.password2 === VALIDATION.REQUIRED && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD2")})}</div>}
                        {!!touched.password2 && errors.password2 === VALIDATION.MIN_LENGTH && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.MIN_LENGTH", {
                          field: t("AUTH.PASSWORD2"),
                          length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)
                        })}</div>}
                        {(!!touched.password || !!touched.password2) && errors.password2 === VALIDATION.MISMATCH && <div
                          className="text-left invalid-field2">{t("COMMON.VALIDATION.MISMATCH", {field: t("AUTH.PASSWORD")})}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                </div>
                <div className="text-center mt-4 mb-3 mx-5">
                  <MDBBtn type="submit" color="white" rounded className="full-width z-depth-1a blue-grey-text"
                          disabled={!!isSubmitting || (!!errors && !!Object.keys(errors).length)}>
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
