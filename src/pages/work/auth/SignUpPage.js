import React, {Fragment, useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
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
import {useDispatch} from "react-redux";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {Formik} from "formik";
import * as Yup from "yup";
import {Base64} from "js-base64";
import hash from "object-hash";
import GoogleLogin from "react-google-login";

import toast, {Fade} from "components/MyToast";
import {AUTH, COUNTRY, DEFAULT, EFFECT, ERROR, PROJECT, RESULT, STATUS, VALIDATION,} from "core/globals";
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

  const pageTitle = `${t("COMMON.AUTH.SIGN_UP")} - ${t("SITE_NAME")}`;

  const initialValues = {
    email: PROJECT.IS_DEV ? DEFAULT.USER.EMAIL : "",
    username: PROJECT.IS_DEV ? DEFAULT.USER.USERNAME : "",
    firstName: PROJECT.IS_DEV ? DEFAULT.USER.FIRST_NAME : "",
    fatherName: PROJECT.IS_DEV ? DEFAULT.USER.FATHER_NAME : "",
    lastName: PROJECT.IS_DEV ? DEFAULT.USER.LAST_NAME : "",
    countryCode: PROJECT.IS_DEV ? COUNTRY.CODE2.SAUDI_ARABIA : "",
    phone: PROJECT.IS_DEV ? DEFAULT.USER.PHONE : "",
    password: PROJECT.IS_DEV ? DEFAULT.USER.PASSWORD : "",
    password2: PROJECT.IS_DEV ? DEFAULT.USER.PASSWORD : "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.EMAIL")}))
      .email(t("COMMON.VALIDATION.INVALID", {field: t("COMMON.FIELDS.USER.EMAIL")})),
    username: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.USERNAME")}))
      .max(AUTH.USERNAME_MAX_LENGTH, t("COMMON.VALIDATION.MAX_LENGTH", {
        field: t("COMMON.FIELDS.USER.USERNAME"),
        length: t(`COMMON.CARDINALS.${AUTH.USERNAME_MAX_LENGTH}`)
      }))
      .test("isUsername", t("COMMON.VALIDATION.INVALID", {field: t("COMMON.FIELDS.USER.USERNAME")}), validators.isUsername),
    firstName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.FIRST_NAME")})),
    fatherName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.FATHER_NAME")})),
    lastName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.LAST_NAME")})),
    countryCode: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.COUNTRY.CODE2")})),
    phone: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.PHONE")}))
      .test("isPhoneNumber", t("COMMON.VALIDATION.INVALID", {field: t("COMMON.FIELDS.USER.PHONE")}), function (value) {
        return validators.isPhoneNumber(`${this.parent.countryCode}${value}`);
      }),
    password: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.PASSWORD")}))
      .min(AUTH.PASSWORD_MIN_LENGTH, t("COMMON.VALIDATION.MIN_LENGTH", {
        field: t("COMMON.FIELDS.USER.PASSWORD"),
        length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)
      })),
    password2: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.PASSWORD2")}))
      .oneOf([Yup.ref("password"), null], t("COMMON.VALIDATION.MISMATCH", {field: t("COMMON.FIELDS.USER.PASSWORD")})),
  });

  const handleSubmit = (params, {setSubmitting}) => {
    setSubmitting(true);
    dispatch(auth.requestSignUp(params));
    Service.signUp(params)
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          dispatch(auth.successSignUp(res.data));
          toast.success(res.message);
        } else {
          dispatch(auth.failureSignUp(res.message));
          toast.error(res.message);
        }
        setSubmitting(false);
      })
      .catch(err => {
        dispatch(auth.failureSignUp(ERROR.UNKNOWN_SERVER_ERROR));
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setSubmitting(false);
      });
  };

  const callbackGoogleSuccess = e => {
    const {profileObj: {googleId, email, givenName, familyName}, tokenObj: {id_token}} = e;
    const params = {
      googleId, email, firstName: givenName, lastName: familyName, id_token,
    };
    const cipher = Base64.encode(JSON.stringify(params)).replace(/\//, "@");
    const checksum = hash(cipher);
    history.push(`${routes.auth.googleSignUp}/${cipher}/${checksum}`);
  };

  const callbackGoogleFailure = e => {
    toast.error(t("COMMON.AUTH.ERROR.GOOGLE_AUTHENTICATION_IS_FAILED"));
  };

  const callbackFacebook = e => {
    const {status, id, email, first_name, last_name, accessToken} = e;
    if (!id || status === STATUS.UNKNOWN) {
      toast.error(t("COMMON.AUTH.ERROR.FACEBOOK_AUTHENTICATION_IS_FAILED"));
      return;
    }
    const params = {
      socialId: id, email, first_name, last_name, accessToken
    };
    const cipher = Base64.encode(JSON.stringify(params)).replace(/\//, "@");
    const checksum = hash(cipher);
    history.push(`${routes.auth.facebookSignUp}/${cipher}/${checksum}`);
  };

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, [props]);

  useMemo(e => {

  });

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle}</title>
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
              <Link to={routes.auth.signIn}><p className="text-white h5">{t("COMMON.AUTH.SIGN_IN")}</p></Link>
            </MDBCol>
            <MDBCol className="col-6 col-lg-4 underlined white-border">
              <p className="text-white h5">{t("COMMON.AUTH.SIGN_UP")}</p>
            </MDBCol>
          </MDBRow>
          <Formik
            initialValues={initialValues}
            // validate={validate}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <input hidden id="countryCode" name="countryCode" onChange={handleChange} onBlur={handleBlur}/>
                <div className="white-text">
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput id="email" name="email" type="email" label={t("COMMON.FIELDS.USER.EMAIL")} background
                                containerClass="mb-0" value={values.email} onChange={handleChange} onBlur={handleBlur}>
                        {!!touched.email && !!errors.email && <div className="text-left invalid-field2">{errors.email}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="username" name="username" type="text" label={t("COMMON.FIELDS.USER.USERNAME")} background
                                containerClass="mb-0" value={values.username} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.username && !!errors.username && <div className="text-left invalid-field2">{errors.username}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput id="firstName" name="firstName" type="text" label={t("COMMON.FIELDS.USER.FIRST_NAME")} background
                                containerClass="mt-3 mb-0" value={values.firstName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.firstName && !!errors.firstName && <div className="text-left invalid-field2">{errors.firstName}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="fatherName" name="fatherName" type="text" label={t("COMMON.FIELDS.USER.FATHER_NAME")} background
                                containerClass="mt-3 mb-0" value={values.fatherName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.fatherName && !!errors.fatherName && <div className="text-left invalid-field2">{errors.fatherName}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="lastName" name="lastName" type="text" label={t("COMMON.FIELDS.USER.LAST_NAME")} background
                                containerClass="mt-3 mb-0" value={values.lastName} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.lastName && !!errors.lastName && <div className="text-left invalid-field2">{errors.lastName}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6" className="mt-2">
                      <MDBSelect label={t("COMMON.FIELDS.USER.COUNTRY_CODE")} className="mt-3 mb-0 white"
                                 selected={values.countryCode} getValue={val => {
                        helpers.triggerChangeEvent("countryCode", val[0])
                      }}>
                        <MDBSelectInput/>
                        <MDBSelectOptions>
                          <MDBSelectOption value={COUNTRY.CODE2.BAHRAIN}
                                           checked={values.countryCode === COUNTRY.CODE2.BAHRAIN}>{COUNTRY.CODE2.BAHRAIN} - {t("COMMON.GCC_COUNTRIES.BAHRAIN")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY.CODE2.KUWAIT}
                                           checked={values.countryCode === COUNTRY.CODE2.KUWAIT}>{COUNTRY.CODE2.KUWAIT} - {t("COMMON.GCC_COUNTRIES.KUWAIT")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY.CODE2.OMAN}
                                           checked={values.countryCode === COUNTRY.CODE2.OMAN}>{COUNTRY.CODE2.OMAN} - {t("COMMON.GCC_COUNTRIES.OMAN")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY.CODE2.QATAR}
                                           checked={values.countryCode === COUNTRY.CODE2.QATAR}>{COUNTRY.CODE2.QATAR} - {t("COMMON.GCC_COUNTRIES.QATAR")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY.CODE2.SAUDI_ARABIA}
                                           checked={values.countryCode === COUNTRY.CODE2.SAUDI_ARABIA}>{COUNTRY.CODE2.SAUDI_ARABIA} - {t("COMMON.GCC_COUNTRIES.SAUDI_ARABIA")}</MDBSelectOption>
                          <MDBSelectOption value={COUNTRY.CODE2.UAE}
                                           checked={values.countryCode === COUNTRY.CODE2.UAE}>{COUNTRY.CODE2.UAE} - {t("COMMON.GCC_COUNTRIES.UAE")}</MDBSelectOption>
                        </MDBSelectOptions>
                      </MDBSelect>
                      {!!touched.countryCode && !!errors.countryCode && <div className="text-left invalid-field2">{errors.countryCode}</div>}
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="phone" name="phone" type="text" label={t("COMMON.FIELDS.USER.PHONE")} background
                                containerClass="mt-3 mb-0" value={values.phone} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!errors.phone && <div className="text-left invalid-field2">{errors.phone}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput id="password" name="password" label={t("COMMON.FIELDS.USER.PASSWORD")} type="password" background
                                containerClass="mt-3" value={values.password} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.password && !!errors.password && <div className="text-left invalid-field2">{errors.password}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="password2" name="password2" label={t("COMMON.FIELDS.USER.PASSWORD2")} type="password" background containerClass="mt-3" value={values.password2} onChange={handleChange}
                                onBlur={handleBlur}>
                        {(!!touched.password || !!touched.password2) && !!errors.password2 && <div className="text-left invalid-field2">{errors.password2}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                </div>
                <div className="text-center mt-4 mb-3 button-wrapper">
                  <MDBBtn type="submit" color="white" rounded className="full-width z-depth-1a blue-grey-text"
                          disabled={!!isSubmitting}>
                    {!isSubmitting && <MDBIcon size="lg" icon={"user-plus"}/>}
                    {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
                    {!isSubmitting && t("COMMON.AUTH.SIGN_UP")}
                  </MDBBtn>
                </div>
              </form>
            )}
          </Formik>
        </MDBCardBody>
      </MDBCard>
    </Fragment>
  );

  return payload();
};
