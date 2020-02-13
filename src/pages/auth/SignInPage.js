import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBNotification,
  MDBRow,
  ToastContainer
} from "mdbreact";
import {useDispatch, useSelector} from "react-redux";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {Formik} from "formik";

import auth from "actions/auth";
import {AUTH, DEFAULT, EFFECT, ERROR, PROJECT, RESULT, VALIDATION,} from "core/globals";
import routes from "core/routes";
import validators from "core/validators";
import toast, {Zoom, Fade} from "components/MyToast";
import images from "core/images";
import Service from "services/AuthService";

import "./SignInPage.scss";
import GoogleLogin from "react-google-login";

export default (props) => {
  const {auth: {redirectUrl}} = useSelector(state => state);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: PROJECT.IS_DEV ? DEFAULT.EMAIL : "",
    password: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
    rememberMe: PROJECT.IS_DEV,
  };

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, [props]);

  const validateForm = ({email, password, rememberMe}) => {
    const errors = {};
    if (!email.length) {
      errors["email"] = VALIDATION.REQUIRED;
    } else if (!validators.isEmail(email)) {
      errors["email"] = VALIDATION.INVALID;
    }

    if (!password.length) {
      errors["password"] = VALIDATION.REQUIRED;
    } else if (password.length < AUTH.PASSWORD_MIN_LENGTH) {
      errors["password"] = VALIDATION.MIN_LENGTH;
    }

    return errors;
  };

  const handleSubmit = async ({email, password, rememberMe}, {setSubmitting}) => {
    try {
      const params = {email, password, rememberMe};
      dispatch(auth.requestSignIn({user: params}));
      setLoading(true);
      setSubmitting(true);
      let res = await Service.signIn(params);
      setLoading(false);
      setSubmitting(false);
      if (res.result === RESULT.SUCCESS) {
        dispatch(auth.successSignIn(res.data));
        const params = new URLSearchParams(props.location.search);
        const redirect = params.get("redirect");
        history.push(redirect || routes.root);
      } else {
        dispatch(auth.failureSignIn(res.message));
        toast.error(res.message);
      }
    } catch (err) {
      setLoading(false);
      setSubmitting(false);
      dispatch(auth.failureSignIn(ERROR.UNKNOWN_SERVER_ERROR));
      toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
    }
  };

  const callbackGoogleSuccess = e => {
    const {profileObj: {email, givenName, familyName}, tokenObj: {id_token}} = e;

    const params = {email, id_token};
    dispatch(auth.requestSignIn({user: params}));
    setLoading(true);
    Service.signInWithGoogle(params)
      .then(res => {
        setLoading(false);
        if (res.result === RESULT.SUCCESS) {
          dispatch(auth.successSignIn(res.data));
          const params = new URLSearchParams(props.location.search);
          const redirect = params.get("redirect");
          history.push(redirect || routes.root);
        } else {
          dispatch(auth.failureSignIn(res.message));
          toast.error(res.message);
        }
      })
      .catch(err => {
        setLoading(false);
        dispatch(auth.failureSignIn(ERROR.UNKNOWN_SERVER_ERROR));
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
      })
  };

  const callbackGoogleFailure = e => {

  };

  return (
    <Fragment>
      <Helmet>
        <title>{t("AUTH.SIGN_IN")} - {t("SITE_NAME")}</title>
      </Helmet>
      <div className="admin-nav text-right">
        {/*<MDBBtn href={routes.admin2} size="sm" rounded color="indigo">{t("COMMON.BUTTON.ADMIN_PAGE")}</MDBBtn>*/}
      </div>
      <div className="text-center">
        <img className="logo-img mt-3 mb-5" src={images.logo.logo100}/>
      </div>
      <MDBCard className="auth-bg">
        <MDBCardBody className="mx-md-4 mx-sm-1">
          <MDBRow className="text-center">
            <MDBCol className="col-6 col-lg-4 underlined white-border">
              <p className="text-white h5">{t("AUTH.SIGN_IN")}</p>
            </MDBCol>
            <MDBCol className="col-6 col-lg-4">
              <Link to={routes.auth.signUp}><p className="text-white h5">{t("AUTH.SIGN_UP")}</p></Link>
            </MDBCol>
          </MDBRow>
          <div className="mt-3 mt-lg-5 mb-2 mb-lg-3 mx-lg-5">
            <div className="text-center">
              <MDBBtn social="fb" rounded className="full-width z-depth-1a mx-0">
                <MDBIcon fab icon="facebook" size="lg"
                         className="pr-1"/> {t("AUTH.SIGN_IN_FACEBOOK")}
              </MDBBtn>
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
                             className="pr-1"/> {t("AUTH.SIGN_IN_GOOGLE")}
                  </MDBBtn>
                )}
              />
            </div>
          </div>
          <hr className="white-border"/>
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSubmit}
          >
            {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <div className="white-text mt-2 mt-lg-3">
                  <MDBInput id="email" name="email" type="email" icon="envelope" label={t("AUTH.EMAIL")} background
                            value={values.email} onChange={handleChange} onBlur={handleBlur}>
                    {!!touched.email && errors.email === VALIDATION.REQUIRED && <div
                      className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.EMAIL")})}</div>}
                    {!!touched.email && errors.email === VALIDATION.INVALID && <div
                      className="text-left invalid-field2">{t("COMMON.VALIDATION.INVALID", {field: t("AUTH.EMAIL")})}</div>}
                  </MDBInput>
                  <MDBInput id="password" name="password" icon="lock" label={t("AUTH.PASSWORD")} type="password"
                            background
                            containerClass="mb-0" value={values.password} onChange={handleChange} onBlur={handleBlur}>
                    {!!touched.password && errors.password === VALIDATION.REQUIRED && <div
                      className="text-left invalid-field2">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD")})}</div>}
                    {!!touched.password && errors.password === VALIDATION.MIN_LENGTH && <div
                      className="text-left invalid-field2">{t("COMMON.VALIDATION.MIN_LENGTH", {
                      field: t("AUTH.PASSWORD"),
                      length: t(`${AUTH.PASSWORD_MIN_LENGTH}`)
                    })}</div>}
                  </MDBInput>
                  <div className="text-left">
                    <MDBInput onChange={handleChange} checked={values.rememberMe || false}
                              label={t("AUTH.REMEMBER_ME")} type="checkbox" filled id="rememberMe"
                              containerClass="mt-4"/>
                  </div>
                </div>
                <div className="text-center mt-4 mb-3 mx-5">
                  <MDBBtn type="submit" color="white" rounded className="full-width z-depth-1a blue-grey-text mx-0"
                          disabled={!!loading || isSubmitting || (!!errors && !!Object.keys(errors).length)}>
                    {!isSubmitting && <MDBIcon size="lg" icon={"sign-in-alt"}/>}
                    {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
                    {!isSubmitting && t("AUTH.SIGN_IN")}
                  </MDBBtn>
                </div>
                <p className="font-small white-text d-flex justify-content-end pb-3">
                  <Link className="ml-1 white-text" to={routes.auth.forgotPassword}>{t("AUTH.FORGOT_PASSWORD")}</Link>
                </p>
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
};
