import React, {Fragment} from "react";
import {MDBBtn, MDBCol, MDBInput, MDBRow} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Formik} from "formik";

import {AUTH, PROJECT, RESULT, VALIDATION} from "core/globals";
import validators from "core/validators";
import authActions from "actions/auth";
import Service from "services/AccountService";
import toast from "components/MyToast";

import "./PersonalInfo.scss";
import * as Yup from "yup";

export default (props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {auth: {user}} = useSelector(state => state);

  const initialValues = {
    username: user.username,
    firstName: user.firstName,
    fatherName: user.fatherName,
    lastName: user.lastName,
  };

  const validationSchema = Yup.object().shape({
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
  });

  const validate = (values) => {
    const {username, firstName, fatherName, lastName} = values;
    const errors = {};

    if (!username.length) {
      errors["username"] = VALIDATION.REQUIRED;
    } else if (!validators.isUsername(username)) {
      errors["username"] = VALIDATION.INVALID;
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

    return errors;
  };

  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);
    Service.savePersonalInfo({...values, id: user.id})
      .then(res => {
        setSubmitting(false);
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          dispatch(authActions.successSignIn(res.data));
          const authData = JSON.stringify({
            signedIn: true,
            user: res.data.user,
            token: res.data.token,
          });
          sessionStorage.setItem(PROJECT.PERSIST_KEY, authData);
          !!localStorage.getItem(PROJECT.PERSIST_KEY) && localStorage.setItem(PROJECT.PERSIST_KEY, authData);
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
    <div className="mt-4">
      <h4 className="h4-responsive text-left grey-text">{t("ACCOUNT.PERSONAL_INFO.PERSONAL_INFO")}</h4>
      <Formik
        initialValues={initialValues}
        // validate={validate}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
          <form onSubmit={handleSubmit} className="mx-0 mx-lg-5">
            <MDBRow>
              <MDBCol md="6">
                <MDBInput id="username" name="username" type="text" label={t("AUTH.USERNAME")} background
                          containerClass="mt-1 mb-0" value={values.username} onChange={handleChange}
                          onBlur={handleBlur}>
                  {/*{!!touched.username && errors.username === VALIDATION.REQUIRED && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.USERNAME")})}</div>}*/}
                  {/*{!!touched.username && errors.username === VALIDATION.INVALID && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.INVALID", {field: t("AUTH.USERNAME")})}</div>}*/}
                  {/*{!!touched.username && errors.username === VALIDATION.MAX_LENGTH && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.MAX_LENGTH", {*/}
                  {/*  field: t("AUTH.USERNAME"),*/}
                  {/*  length: t(`COMMON.CARDINALS.${AUTH.USERNAME_MAX_LENGTH}`)*/}
                  {/*})}</div>}*/}
                  {!!touched.username && !!errors.username && <div className="text-left invalid-field">{errors.username}</div>}
                </MDBInput>
              </MDBCol>
              <MDBCol md="6">
                <MDBInput id="firstName" name="firstName" type="text" label={t("AUTH.FIRST_NAME")} background
                          containerClass="mt-1 mb-0" value={values.firstName} onChange={handleChange}
                          onBlur={handleBlur}>
                  {/*{!!touched.firstName && errors.firstName === VALIDATION.REQUIRED && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FIRST_NAME")})}</div>}*/}
                  {!!touched.firstName && !!errors.firstName && <div className="text-left invalid-field">{errors.firstName}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput id="fatherName" name="fatherName" type="text" label={t("AUTH.FATHER_NAME")} background
                          containerClass="mt-3 mb-0" value={values.fatherName} onChange={handleChange}
                          onBlur={handleBlur}>
                  {/*{!!touched.fatherName && errors.fatherName === VALIDATION.REQUIRED && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FATHER_NAME")})}</div>}*/}
                  {!!touched.fatherName && !!errors.fatherName && <div className="text-left invalid-field">{errors.fatherName}</div>}
                </MDBInput>
              </MDBCol>
              <MDBCol md="6">
                <MDBInput id="lastName" name="lastName" type="text" label={t("AUTH.LAST_NAME")} background
                          containerClass="mt-3 mb-0" value={values.lastName} onChange={handleChange}
                          onBlur={handleBlur}>
                  {/*{!!touched.lastName && errors.lastName === VALIDATION.REQUIRED && <div*/}
                  {/*  className="text-left invalid-field">{t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.LAST_NAME")})}</div>}*/}
                  {!!touched.lastName && !!errors.lastName && <div className="text-left invalid-field">{errors.lastName}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>

            <div className="text-center mt-4 mb-3">
              <MDBBtn type="submit" color="primary" rounded className="z-depth-1a"
                      disabled={!!isSubmitting || (!!errors && !!Object.keys(errors).length)}>
                {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
                {!isSubmitting && t("COMMON.BUTTON.SAVE")}
              </MDBBtn>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );

  return payload();
}