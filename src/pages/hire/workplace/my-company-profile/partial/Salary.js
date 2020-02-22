import React, {Fragment, useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import {useTranslation} from "react-i18next";
import {animateScroll as scroll} from "react-scroll";
import {useFormik} from "formik";
import {useSelector} from "react-redux";
import * as Yup from "yup";

import {ALERT, EFFECT, RESULT} from "core/globals";
import Loading from "components/Loading";
import toast from "components/MyToast";
import Service from "services/hire/workplace/MyCompanyProfilesService";

export default () => {
  const {t} = useTranslation();
  const {auth: {user}} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  let formikProps;

  const initialValues = {
    unit: "",
    min: 0,
    max: 0,
  };

  const validationSchema = Yup.object().shape({
    unit: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.FIELDS.SALARY.UNIT")})),
    min: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.FIELDS.SALARY.MIN")}))
      .min(0, t("COMMON.VALIDATION.MIN", {field: t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.FIELDS.SALARY.MIN"), value: 0})),
    max: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.FIELDS.SALARY.MAX")}))
      .test("greaterThan", t("COMMON.VALIDATION.GREATER_THAN", {field: t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.FIELDS.SALARY.MIN")}), function (value) {
        return value >= this.parent.min;
      }),
  });

  const loadData = () => {
    setLoading(true);
    Service.loadSalary({id: user.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          const data = res.data;
          const {unit, min, max} = data;
          !!formikProps && formikProps.setValues({
            unit: unit || "",
            min: min || 0,
            max: max || 0,
          });
          !!formikProps && formikProps.setTouched({});
          !!formikProps && formikProps.setErrors({});
          setAlert({});
        } else {
          setAlert({
            show: true,
            color: ALERT.DANGER,
            message: res.message,
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setAlert({
          show: true,
          color: ALERT.DANGER,
          message: t('COMMON.ERROR.UNKNOWN_SERVER_ERROR'),
        });
        setLoading(false);
      });
  };

  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);
    Service.saveSalary({...values, id: user.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          setIsEditing(false);
        } else {
          toast.error(res.message);
        }
        setSubmitting(false);
      })
      .catch(err => {
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setSubmitting(false);
      });
  };

  useEffect(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });

    loadData();
  }, []);

  formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {values, touched, errors, setValues, setTouched, setErrors, handleChange, handleBlur, isSubmitting} = formikProps;

  const payload = () => (
    <div className="mt-3">
      {/*{alert.show && <MDBCol md="12">*/}
      {/*  <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>*/}
      {/*    <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>*/}
      {/*  </CSSTransition>*/}
      {/*</MDBCol>}*/}
      <form className="text-left" onSubmit={formikProps.handleSubmit}>
        <MDBRow>
          <MDBCol>
            <h4
              className="h4-responsive text-left grey-text mr-auto pt-1">{t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.SALARY")}</h4>
          </MDBCol>
          <MDBCol>
            <div className="text-right ml-auto mr-md-4">
              {!!isEditing && <MDBBtn type="submit" tag="a" floating color="primary" size="sm" rounded className="my-0"
                                      disabled={!!loading || !!isSubmitting || (!!errors && !!Object.keys(errors).length)} onClick={formikProps.handleSubmit}>
                <MDBIcon icon="save" size="lg" />
              </MDBBtn>}
              {!!isEditing && <MDBBtn type="button" tag="a" floating color="warning" size="sm" rounded className="my-0"
                                      disabled={!!loading || !!isSubmitting}
                                      onClick={e => setIsEditing(false)}>
                <MDBIcon icon="times" size="lg" />
              </MDBBtn>}
              {!isEditing && <MDBBtn type="button" tag="a" floating color="warning" size="sm" rounded className="my-0"
                                     disabled={!!loading || !!isSubmitting}
                                     onClick={e => setIsEditing(true)}>
                <MDBIcon icon="edit" size="lg" />
              </MDBBtn>}
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12">
            {!!loading && <Loading style={{height: 64}}/>}
            {!loading && <Fragment>
            {/*{<Fragment>*/}
              <div className="mx-md-4 mx-sm-1 ">
                <MDBRow>
                  <MDBCol md="4">
                    <MDBInput id="unit" name="unit" label={t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.FIELDS.SALARY.UNIT")}
                              background={!isEditing} outline={isEditing}
                              containerClass="mt-2 mb-0" value={values.unit} disabled={!isEditing} onChange={handleChange}
                              onBlur={handleBlur}>
                      {!!touched.unit && !!errors.unit && <div className="text-left invalid-field">{errors.unit}</div>}
                    </MDBInput>
                  </MDBCol>
                  <MDBCol md="4">
                    <MDBInput id="min" name="min" type="number"
                              label={t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.FIELDS.SALARY.MIN")} background={!isEditing} outline={isEditing}
                              containerClass="mt-2 mb-0" value={values.min} disabled={!isEditing} onChange={handleChange}
                              onBlur={handleBlur}>
                      {!!touched.min && !!errors.min && <div className="text-left invalid-field">{errors.min}</div>}
                    </MDBInput>
                  </MDBCol>
                  <MDBCol md="4">
                    <MDBInput id="max" name="max" type="number"
                              label={t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.FIELDS.SALARY.MAX")} background={!isEditing} outline={isEditing}
                              containerClass="mt-2 mb-0" value={values.max} disabled={!isEditing} onChange={handleChange}
                              onBlur={handleBlur}>
                      {!!touched.max && !!errors.max && <div className="text-left invalid-field">{errors.max}</div>}
                    </MDBInput>
                  </MDBCol>
                </MDBRow>
              </div>
            </Fragment>}
          </MDBCol>
        </MDBRow>
      </form>
    </div>
  );

  return payload();
};
