import React, {Fragment, useEffect, useMemo, useRef, useState} from "react";
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
import {
  AUTH, AVATAR,
  COUNTRY,
  DEFAULT,
  DELAY,
  EFFECT,
  ERROR,
  FILE_UPLOAD,
  PROJECT,
  RESULT,
  STATUS,
  VALIDATION,
} from "core/globals";
import routes from "core/routes";
import validators from "core/validators";
import helpers from "core/helpers";
import images from "core/images";
import useDebounce from "helpers/useDebounce";
import Service from "services/work/AuthService";
import auth from "actions/auth";

import "./SignUpPage.scss";
import CoreService from "services/CoreService";
import MDBFileupload from "mdb-react-fileupload";

export default (props) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const history = useHistory();

  const [rawJobRoles, setRawJobRoles] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [file, setFile] = useState(null);

  const [jobRoleSearch, setJobRoleSearch] = useState("");

  const debouncedJobRoleSearch = useDebounce(jobRoleSearch, DELAY.DELAY2);

  const fileRef = useRef(null);

  const lang = t("CODE");
  const pageTitle = `${t("COMMON.AUTH.SIGN_UP")} - ${t("SITE_NAME")}`;

  const initialValues = {
    firstName: PROJECT.IS_DEV ? DEFAULT.USER.FIRST_NAME : "",
    fatherName: PROJECT.IS_DEV ? DEFAULT.USER.FATHER_NAME : "",
    lastName: PROJECT.IS_DEV ? DEFAULT.USER.LAST_NAME : "",
    email: PROJECT.IS_DEV ? DEFAULT.USER.EMAIL : "",
    password: PROJECT.IS_DEV ? DEFAULT.USER.PASSWORD : "",
    jobRoleId: PROJECT.IS_DEV ? DEFAULT.USER.JOB_ROLE_ID : "0",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.EMAIL")}))
      .email(t("COMMON.VALIDATION.INVALID", {field: t("COMMON.FIELDS.USER.EMAIL")})),
    firstName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.FIRST_NAME")})),
    fatherName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.FATHER_NAME")})),
    lastName: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.LAST_NAME")})),
    password: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.PASSWORD")}))
      .min(AUTH.PASSWORD_MIN_LENGTH, t("COMMON.VALIDATION.MIN_LENGTH", {
        field: t("COMMON.FIELDS.USER.PASSWORD"),
        length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)
      })),
    jobRoleId: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("WORK.ACCOUNT.FIELDS.JOB_ROLE")})),
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

  const handleSubmit = (params, {setSubmitting}) => {
    const {firstName, fatherName, lastName, email, password, jobRoleId} = params;
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("fatherName", fatherName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("jobRoleId", jobRoleId);
    !!file && formData.append("file", file);

    setSubmitting(true);
    dispatch(auth.requestSignUp(params));
    Service.signUp(formData)
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

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
    loadJobRoles();
  }, [props]);

  useMemo(e => {
    const items = [];
    for (let item of rawJobRoles) {
      items.push({
        value: item.id,
        text: item[`jobRole_${lang}`],
        lowercase: item[`jobRole_${lang}`].toLowerCase(),
      });
    }
    setJobRoles(items);
  }, [t, rawJobRoles]);

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
              <Link to={routes.work.auth.signIn}><p className="text-white h5">{t("COMMON.AUTH.SIGN_IN")}</p></Link>
            </MDBCol>
            <MDBCol className="col-6 col-lg-4 underlined white-border">
              <p className="text-white h5">{t("COMMON.AUTH.SIGN_UP")}</p>
            </MDBCol>
          </MDBRow>
          {/*<div className="mt-3 mt-lg-5 mb-2 mb-lg-3 mx-lg-5">*/}
          {/*  <div className="text-center">*/}
          {/*    <FacebookLogin*/}
          {/*      appId={AUTH.FACEBOOK.APP_ID}*/}
          {/*      // autoLoad*/}
          {/*      fields="first_name,last_name,email"*/}
          {/*      cookie={true}*/}
          {/*      callback={callbackFacebook}*/}
          {/*      render={({isDisabled, isProcessing, isSdkLoaded, onClick}) => (*/}
          {/*        <MDBBtn social="fb" rounded className="full-width z-depth-1a mx-0" onClick={onClick} disabled={isDisabled || isProcessing || !isSdkLoaded}>*/}
          {/*          <MDBIcon fab icon="facebook" size="lg"*/}
          {/*          className="pr-1"/>*/}
          {/*          {t("COMMON.FIELDS.USER.SIGN_UP_FACEBOOK")}*/}
          {/*        </MDBBtn>*/}
          {/*      )}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  <div className="text-center">*/}
          {/*    <GoogleLogin*/}
          {/*      clientId={AUTH.GOOGLE.CLIENT_ID}*/}
          {/*      onSuccess={callbackGoogleSuccess}*/}
          {/*      onFailure={callbackGoogleFailure}*/}
          {/*      // uxMode="redirect"*/}
          {/*      // redirectUri={AUTH.GOOGLE.REDIRECT_URI.SIGN_UP}*/}
          {/*      cookiePolicy={"single_host_origin"}*/}
          {/*      render={({disabled, onClick}) => (*/}
          {/*        <MDBBtn social="gplus" rounded className="full-width z-depth-1a mx-0" onClick={onClick}*/}
          {/*                disabled={disabled}>*/}
          {/*          <MDBIcon fab icon="google-plus-g" size="lg"*/}
          {/*                   className="pr-1"/> {t("COMMON.AUTH.SIGN_UP_GOOGLE")}*/}
          {/*        </MDBBtn>*/}
          {/*      )}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<hr className="white-border"/>*/}
          <Formik
            initialValues={initialValues}
            // validate={validate}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <div className="white-text">
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
                    <MDBCol md="6">
                      <MDBInput id="email" name="email" type="email" label={t("COMMON.FIELDS.USER.EMAIL")} background
                                containerClass="mt-3 mb-0" value={values.email} onChange={handleChange} onBlur={handleBlur}>
                        {!!touched.email && !!errors.email && <div className="text-left invalid-field2">{errors.email}</div>}
                      </MDBInput>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="password" name="password" label={t("COMMON.FIELDS.USER.PASSWORD")} type="password" background
                                containerClass="mt-3" value={values.password} onChange={handleChange}
                                onBlur={handleBlur}>
                        {!!touched.password && !!errors.password && <div className="text-left invalid-field2">{errors.password}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6" className="mt-3">
                      {!!jobRoles.length && <Fragment>
                        <input hidden id="jobRoleId" value={values.jobRoleId} onChange={handleChange} onBlur={handleBlur}/>
                        <MDBSelect className="my-0 white round-border-top" label={t("WORK.ACCOUNT.FIELDS.JOB_ROLE")} selected={values.jobRoleId}
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
                    <MDBCol md="12" className="text-left mt-4">
                      <div className="work-auth-cv-upload mx-auto">
                        <div className="white-text">{t("WORK.ACCOUNT.FIELDS.CV")}</div>
                        <div id="file">
                          <MDBFileupload
                            ref={fileRef}
                            getValue={setFile}
                            showRemove={false}
                            maxFileSize={FILE_UPLOAD.MAXSIZE1}
                            maxFileSizePreview={FILE_UPLOAD.MAXSIZE1}
                            containerHeight={AVATAR.SIZE.HEIGHT + 50}
                            // allowedFileExtensions={extensions}
                            messageDefault={t("COMMON.FILE_UPLOAD.DEFAULT")}
                            messageReplace={t("COMMON.FILE_UPLOAD.REPLACE")}
                            messageRemove={t("COMMON.FILE_UPLOAD.REMOVE")}
                            messageError={t("COMMON.FILE_UPLOAD.ERROR")}
                            errorFileSize={t("COMMON.FILE_UPLOAD.ERROR_FILESIZE", {max: FILE_UPLOAD.MAXSIZE1})}
                            // errorFileExtension={t("COMMON.FILE_UPLOAD.ERROR_FILEEXTENSION", {extensions: extensions.join(", ")})}
                          />
                        </div>
                      </div>
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
