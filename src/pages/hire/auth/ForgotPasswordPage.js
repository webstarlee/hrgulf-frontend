import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow, ToastContainer} from "mdbreact";
import {CSSTransition} from "react-transition-group";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {Formik} from "formik";
import * as Yup from "yup";

import {ALERT, EFFECT, RESULT, VALIDATION} from "core/globals";
import validators from "core/validators";
import images from "core/images";
import routes from "core/routes";
import toast, {Fade} from "components/MyToast";
import Service from "services/AuthService";

import "./ForgotPasswordPage.scss";

export default (props) => {
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.EMAIL")}))
      .email(t("COMMON.VALIDATION.INVALID", {field: t("AUTH.EMAIL")})),
  });

  const validate = ({email}) => {
    const errors = {};
    if (!email.length) {
      errors["email"] = VALIDATION.REQUIRED;
    } else if (!validators.isEmail(email)) {
      errors["email"] = VALIDATION.INVALID;
    }

    return errors;
  };

  const handleSubmit = ({email}, {setSubmitting}) => {
    const params = {email};
    setLoading(true);
    setSubmitting(true);
    Service.sendForgotPasswordMail(params)
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        setLoading(false);
        setSubmitting(false);
      })
      .catch(err => {
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setLoading(false);
        setSubmitting(false);
      });
  };

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, [props]);

  useMemo(e => {

  }, [t]);

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
            // validate={validate}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({values: {email}, errors, touched, handleChange, handleSubmit, handleBlur, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <div className="white-text mt-5">
                  <MDBInput id="email" name="email" type="email" icon="envelope" label={t("AUTH.EMAIL")} background
                            value={email}
                            onChange={handleChange} onBlur={handleBlur}>
                    {/*{touched.email && errors.email === VALIDATION.REQUIRED && <div className="text-left invalid-field2">*/}
                    {/*  {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.EMAIL")})}*/}
                    {/*</div>}*/}
                    {/*{touched.email && errors.email === VALIDATION.INVALID && <div className="text-left invalid-field2">*/}
                    {/*  {t("COMMON.VALIDATION.INVALID", {field: t("AUTH.EMAIL")})}*/}
                    {/*</div>}*/}
                    {!!touched.email && !!errors.email && <div className="text-left invalid-field2">{errors.email}</div>}
                  </MDBInput>
                </div>
                <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME}
                               unmountOnExit
                               appear>
                  <MDBAlert color={alert.color} onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
                </CSSTransition>
                <div className="text-center mt-4 mb-3 mx-5">
                  <MDBBtn type="submit" color="white" rounded className="full-width z-depth-1a blue-grey-text"
                          disabled={loading}>
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
