import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import {CSSTransition} from "react-transition-group";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {Formik} from "formik";

import images from "core/images";
import routes from "core/routes";
import {ALERT, AUTH, EFFECT, RESULT, VALIDATION} from "core/globals";
import Service from "services/AuthService";

import "./ResetPasswordPage.scss";
import validators from "../../core/validators";

export default (props) => {
  const {email, token} = useParams();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [IsInvalid, setIsInvalid] = useState(true);
  const [alert, setAlert] = useState({});

  const initialValues = {
    password: "",
  };

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });

    setLoading(true);
    Service.validateToken({email, token})
      .then(res => {
        setLoading(false);
        if (res.result !== RESULT.SUCCESS) {
          setIsInvalid(true);
          setAlert({
            show: true,
            color: ALERT.DANGER,
            message: res.message,
          });
        } else {
          setIsInvalid(false);
        }
      })
      .catch(err => {
        setLoading(false);
        setIsInvalid(true);
        setAlert({
          show: true,
          color: ALERT.DANGER,
          message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
        });
      });
  }, [props]);

  const validateForm = ({password}) => {
    const errors = {};
    if (!password.length) {
      errors["password"] = VALIDATION.REQUIRED;
    } else if (!password.length < AUTH.PASSWORD_MIN_LENGTH) {
      errors["password"] = VALIDATION.INVALID;
    }

    return errors;
  };

  const handleSubmit = async ({password}, {setSubmitting}) => {
    try {
      const params = {email, token, password};
      setLoading(true);
      setSubmitting(true);
      let res = await Service.resetPassword(params);
      setLoading(false);
      setSubmitting(false);
      setAlert({
        show: true,
        color: res.result === ALERT.SUCCESS ? ALERT.SUCCESS : ALERT.DANGER,
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

  return (
    <Fragment>
      <Helmet>
        <title>{t("AUTH.RESET_PASSWORD")} - {t("SITE_NAME")}</title>
      </Helmet>
      <div className="admin-nav text-center">
        <img className="logo-img mt-3 mb-5" src={images.logo.logo100}/>
      </div>
      <MDBCard className="auth-bg">
        <MDBCardBody className="mx-md-4 mx-sm-1">
          <MDBRow className="text-center">
            <MDBCol className="col-12 underlined white-border">
              <p className="text-white h5">{t("AUTH.RESET_PASSWORD")}</p>
            </MDBCol>
          </MDBRow>
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSubmit}>
            {({values: {password}, errors, touched, handleChange, handleSubmit, handleBlur, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <div className="white-text mt-5">
                  <MDBInput id="password" name="password" type="password" icon="lock" label={t("AUTH.PASSWORD")} background
                            value={password}
                            onChange={handleChange} onBlur={handleBlur}>
                    {touched.password && errors.password === VALIDATION.REQUIRED && <div className="text-left invalid-field2">
                      {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD")})}
                    </div>}
                    {touched.password && errors.password === VALIDATION.MIN_LENGTH && <div className="text-left invalid-field2">
                      {t("COMMON.VALIDATION.MIN_LENGTH", {field: t("AUTH.PASSWORD"), length: AUTH.PASSWORD_MIN_LENGTH})}
                    </div>}
                  </MDBInput>
                </div>
                <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit
                               appear>
                  <MDBAlert color={alert.color} onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
                </CSSTransition>
                <div className="text-center mt-4 mb-3 mx-5">
                  <MDBBtn type="submit" color="white" rounded className="full-width z-depth-1a blue-grey-text"
                          disabled={loading || IsInvalid || (!!errors && !!Object.keys(errors).length)}>
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
};
