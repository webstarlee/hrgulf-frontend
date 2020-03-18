import React, {Fragment} from "react";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import {MDBBreadcrumb, MDBBreadcrumbItem, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBInput, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";
import {Formik} from "formik";
import * as Yup from "yup";
import {useSelector} from "react-redux";

import routes from "core/routes";
import {AUTH, DEFAULT, PROJECT, RESULT} from "core/globals";
import toast from "components/MyToast";
import goToBack from "helpers/goToBack";
import Service from "services/AccountService";

import "./PasswordPage.scss";

export default () => {
  const {t} = useTranslation();

  const {auth: {user}} = useSelector(state => state);

  const pageTitle = t("HIRE.MY_ACCOUNT.PASSWORD.PAGE_TITLE");

  const initialValues = {
    password0: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
    password: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
    password2: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
  };

  const validationSchema = Yup.object().shape({
    password0: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("COMMON.FIELDS.USER.PASSWORD")}))
      .min(AUTH.PASSWORD_MIN_LENGTH, t("COMMON.VALIDATION.MIN_LENGTH", {
        field: t("COMMON.FIELDS.USER.PASSWORD"),
        length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)
      })),
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

  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);
    Service.changePassword({...values, id: user.id})
      .then(res => {
        setSubmitting(false);
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .catch(err => {
        setSubmitting(false);
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
      });
  };

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem><Link to={routes.hire.account.main}>{t("NAVBAR.HIRE.ACCOUNT.MY_ACCOUNT")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBRow >
        <MDBCol md="12">
          <MDBCard>
            <MDBCardBody>
              {/*<h4 className="h4-responsive">*/}
              {/*  {pageTitle}*/}
              {/*</h4>*/}

              {/*{!!user.social.length && <div className="mx-0 mx-lg-5 grey-text">*/}
              {/*  {user.social === SOCIAL.NAME.GOOGLE && t("ACCOUNT.PASSWORD.GOOGLE_SIGNED_IN")}*/}
              {/*  {user.social === SOCIAL.NAME.FACEBOOK && t("ACCOUNT.PASSWORD.FACEBOOK_SIGNED_IN")}*/}
              {/*</div>}*/}

              {/*{!user.social.length && <Formik*/}
              {/*  initialValues={initialValues}*/}
              {/*  validationSchema={validationSchema}*/}
              {/*  onSubmit={handleSubmit}*/}
              {/*>*/}
              {<Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
                  <form onSubmit={handleSubmit} className="text-left">
                  {/*<form onSubmit={handleSubmit} className="mx-0 mx-lg-5 text-left">*/}
                    <MDBRow>
                      <MDBCol md="6">
                        <label>{t("COMMON.FIELDS.USER.CURRENT_PASSWORD")}</label>
                        <MDBInput id="password0" name="password0" type="password" outline
                                  containerClass="my-0" value={values.password0} onChange={handleChange}
                                  onBlur={handleBlur}>
                          {!!touched.password0 && !!errors.password0 && <div className="text-left invalid-field">{errors.password0}</div>}
                        </MDBInput>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow className="mt-3 text-left">
                      <MDBCol md="6">
                        <label>{t("COMMON.FIELDS.USER.NEW_PASSWORD")}</label>
                        <MDBInput id="password" name="password" type="password" outline
                                  containerClass="my-0" value={values.password} onChange={handleChange}
                                  onBlur={handleBlur}>
                          {!!touched.password && !!errors.password && <div className="text-left invalid-field">{errors.password}</div>}
                        </MDBInput>
                      </MDBCol>
                      <MDBCol md="6">
                        <label>{t("COMMON.FIELDS.USER.PASSWORD2")}</label>
                        <MDBInput id="password2" name="password2" type="password" outline
                                  containerClass="my-0" value={values.password2} onChange={handleChange}
                                  onBlur={handleBlur}>
                          {(!!touched.password || !!touched.password2) && !!errors.password2 && <div className="text-left invalid-field">{errors.password2}</div>}
                        </MDBInput>
                      </MDBCol>
                    </MDBRow>

                    <div className="text-center mt-4 mb-3">
                      <MDBBtn type="submit" color="primary" size="sm" rounded className="z-depth-1a"
                              disabled={!!isSubmitting}>
                        {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
                        {!isSubmitting && t("COMMON.BUTTON.CHANGE")}
                      </MDBBtn>
                      <MDBBtn type="button" flat color="warning" size="sm" rounded className="z-depth-1a" onClick={goToBack}
                              disabled={!!isSubmitting}>
                        {t("COMMON.BUTTON.BACK")}
                      </MDBBtn>
                    </div>
                  </form>
                )}
              </Formik>}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </Fragment>
  );

  return payload();
}