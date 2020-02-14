import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import {CSSTransition} from "react-transition-group";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {Formik} from "formik";

import {ALERT, EFFECT, RESULT, VALIDATION} from "core/globals";
import validators from "core/validators";
import images from "core/images";
import {Link} from "react-router-dom";
import routes from "core/routes";
import Service from "services/AuthService";

import "./ForgotPasswordPage.scss";

export default (props) => {
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const initialValues = {
    email: "",
  };

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, [props]);

  const validate = ({email}) => {
    const errors = {};
    if (!email.length) {
      errors["email"] = VALIDATION.REQUIRED;
    } else if (!validators.isEmail(email)) {
      errors["email"] = VALIDATION.INVALID;
    }

    return errors;
  };

  const handleSubmit = async ({email}, {setSubmitting}) => {
    // event.preventDefault();
    try {
      const params = {email};
      setLoading(true);
      setSubmitting(true);
      let res = await Service.sendForgotPasswordMail(params);
      setLoading(false);
      setSubmitting(false);
      setAlert({
        show: true,
        color: res.result === RESULT.SUCCESS ? ALERT.SUCCESS : ALERT.DANGER,
        message: res.message,
      });
    } catch (err) {
      setLoading(false);
      setSubmitting(false);
      setAlert({
        show: true,
        color: ALERT.DANGER,
        message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
      });
    }
  };

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{t("AUTH.FORGOT_PASSWORD")} - {t("SITE_NAME")}</title>
      </Helmet>
      <div className="admin-nav text-center">
        <img className="logo-img mt-3 mb-5" src={images.logo.logo100}/>
      </div>
      <MDBCard className="auth-bg">
        <MDBCardBody className="mx-md-4 mx-sm-1">
          <MDBRow className="text-center">
            <MDBCol className="col-12 underlined white-border">
              <p className="text-white h5">{t("AUTH.FORGOT_PASSWORD")}</p>
            </MDBCol>
          </MDBRow>
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}>
            {({values: {email}, errors, touched, handleChange, handleSubmit, handleBlur, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <div className="white-text mt-5">
                  <MDBInput id="email" name="email" type="email" icon="envelope" label={t("AUTH.EMAIL")} background
                            value={email}
                            onChange={handleChange} onBlur={handleBlur}>
                    {touched.email && errors.email === VALIDATION.REQUIRED && <div className="text-left invalid-field2">
                      {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.EMAIL")})}
                    </div>}
                    {touched.email && errors.email === VALIDATION.INVALID && <div className="text-left invalid-field2">
                      {t("COMMON.VALIDATION.INVALID", {field: t("AUTH.EMAIL")})}
                    </div>}
                  </MDBInput>
                </div>
                <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME}
                               unmountOnExit
                               appear>
                  <MDBAlert color={alert.color} onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
                </CSSTransition>
                <div className="text-center mt-4 mb-3 mx-5">
                  <MDBBtn type="submit" color="white" rounded className="full-width z-depth-1a blue-grey-text"
                          disabled={loading || (!!errors && !!Object.keys(errors).length)}>
                    {!loading && <MDBIcon icon={"lock"}/>}
                    {!!loading && <div className="spinner-grow spinner-grow-sm" role="status"/>}
                    {t("AUTH.RESET_PASSWORD")}
                  </MDBBtn>
                </div>
                <p className="font-small white-text d-flex justify-content-end pb-3">
                  <Link className="ml-1 white-text" to={routes.auth.signIn}>{t("AUTH.SIGN_IN")}</Link>
                </p>
              </form>
            )}
          </Formik>
        </MDBCardBody>
      </MDBCard>
    </Fragment>
  );

  return payload();
};
