import React, {useMemo} from "react";
import {MDBBtn, MDBCol, MDBInput, MDBRow} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Formik} from "formik";

import {AUTH, DEFAULT, PROJECT, RESULT, SOCIAL, VALIDATION} from "core/globals";
import Service from "services/AccountService";
import toast from "components/MyToast";

import "./Password.scss";
import * as Yup from "yup";
import validators from "../../../core/validators";

export default (props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {auth: {user}} = useSelector(state => state);

  const initialValues = {
    password0: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
    password: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
    password2: PROJECT.IS_DEV ? DEFAULT.PASSWORD : "",
  };

  const validationSchema = Yup.object().shape({
    password0: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD")}))
      .min(AUTH.PASSWORD_MIN_LENGTH, t("COMMON.VALIDATION.MIN_LENGTH", {
        field: t("AUTH.PASSWORD"),
        length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)
      })),
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

  const validate = (values) => {
    const {password0, password, password2} = values;
    const errors = {};

    if (!password0.length) {
      errors["password0"] = VALIDATION.REQUIRED;
    } else if (password0.length < AUTH.PASSWORD_MIN_LENGTH) {
      errors["password0"] = VALIDATION.MIN_LENGTH;
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

  useMemo(e => {

  }, [t]);

  const payload = () => (
    <div className="mt-4">
      <h4 className="h4-responsive text-left grey-text">{t("ACCOUNT.PASSWORD.PASSWORD")}</h4>
      {!!user.social.length && <div className="mx-0 mx-lg-5 grey-text">
        {user.social === SOCIAL.NAME.GOOGLE && t("ACCOUNT.PASSWORD.GOOGLE_SIGNED_IN")}
        {user.social === SOCIAL.NAME.FACEBOOK && t("ACCOUNT.PASSWORD.FACEBOOK_SIGNED_IN")}
      </div>}
      {!user.social.length && <Formik
        initialValues={initialValues}
        // validate={validate}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
          <form onSubmit={handleSubmit} className="mx-0 mx-lg-5">
            <MDBRow>
              <MDBCol md="6">
                <MDBInput id="password0" name="password0" label={t("ACCOUNT.PASSWORD.CURRENT_PASSWORD")} type="password" background
                          containerClass="mt-1 mb-0" value={values.password0} onChange={handleChange}
                          onBlur={handleBlur}>
                  {/*{!!touched.password0 && errors.password0 === VALIDATION.REQUIRED && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.REQUIRED", {field: t("ACCOUNT.PASSWORD.CURRENT_PASSWORD")})}</div>}*/}
                  {/*{!!touched.password0 && errors.password0 === VALIDATION.MIN_LENGTH && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.MIN_LENGTH", {*/}
                  {/*  field: t("ACCOUNT.PASSWORD.CURRENT_PASSWORD"),*/}
                  {/*  length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)*/}
                  {/*})}</div>}*/}
                  {!!touched.password0 && !!errors.password0 && <div className="text-left invalid-field">{errors.password0}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput id="password" name="password" label={t("ACCOUNT.PASSWORD.NEW_PASSWORD")} type="password" background
                          containerClass="mt-3" value={values.password} onChange={handleChange}
                          onBlur={handleBlur}>
                  {/*{!!touched.password && errors.password === VALIDATION.REQUIRED && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.REQUIRED", {field: t("ACCOUNT.PASSWORD.NEW_PASSWORD")})}</div>}*/}
                  {/*{!!touched.password && errors.password === VALIDATION.MIN_LENGTH && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.MIN_LENGTH", {*/}
                  {/*  field: t("ACCOUNT.PASSWORD.NEW_PASSWORD"),*/}
                  {/*  length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)*/}
                  {/*})}</div>}*/}
                  {!!touched.password && !!errors.password && <div className="text-left invalid-field">{errors.password}</div>}
                </MDBInput>
              </MDBCol>
              <MDBCol md="6">
                <MDBInput id="password2" name="password2" label={t("ACCOUNT.PASSWORD.PASSWORD2")} type="password" background
                          containerClass="mt-3" value={values.password2} onChange={handleChange}
                          onBlur={handleBlur}>
                  {/*{!!touched.password2 && errors.password2 === VALIDATION.REQUIRED && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.REQUIRED", {field: t("ACCOUNT.PASSWORD.PASSWORD2")})}</div>}*/}
                  {/*{!!touched.password2 && errors.password2 === VALIDATION.MIN_LENGTH && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.MIN_LENGTH", {*/}
                  {/*  field: t("ACCOUNT.PASSWORD.PASSWORD2"),*/}
                  {/*  length: t(`COMMON.CARDINALS.${AUTH.PASSWORD_MIN_LENGTH}`)*/}
                  {/*})}</div>}*/}
                  {/*{(!!touched.password || !!touched.password2) && errors.password2 === VALIDATION.MISMATCH && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.MISMATCH", {field: t("ACCOUNT.PASSWORD.NEW_PASSWORD")})}</div>}*/}
                  {(!!touched.password || !!touched.password2) && !!errors.password2 && <div className="text-left invalid-field">{errors.password2}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>

            <div className="text-center mt-4 mb-3">
              <MDBBtn type="submit" color="primary" rounded className="z-depth-1a"
                      disabled={!!isSubmitting || (!!errors && !!Object.keys(errors).length)}>
                {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
                {!isSubmitting && t("ACCOUNT.PASSWORD.CHANGE_PASSWORD")}
              </MDBBtn>
            </div>
          </form>
        )}
      </Formik>}
    </div>
  );

  return payload();
}