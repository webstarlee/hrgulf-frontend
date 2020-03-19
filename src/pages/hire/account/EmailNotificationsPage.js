import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBInput,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions
} from "mdbreact";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {COMPANY, DELAY, PROJECT, RESULT} from "core/globals";
import helpers from "core/helpers";
import routes from "core/routes";
import authActions from "actions/auth";
import useDebounce from "helpers/useDebounce";
import toast from "components/MyToast";
import Service from "services/hire/account/AccountService";
import CoreService from "services/CoreService";

import "./EmailNotificationsPage.scss";

export default () => {
  const {t} = useTranslation();
  const {auth} = useSelector(state => state);
  const {hire} = auth;
  const dispatch = useDispatch();

  const [rawSectors, setRawSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [rawIndustries, setRawIndustries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);

  const [sectorSearch, setSectorSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");

  const debouncedSectorSearch = useDebounce(sectorSearch, DELAY.DELAY2);
  const debouncedIndustrySearch = useDebounce(industrySearch, DELAY.DELAY2);

  const pageTitle = t("HIRE.MY_ACCOUNT.EMAIL_NOTIFICATIONS.PAGE_TITLE");

  const lang = t("CODE");

  const initialValues = {
    name: hire.name,
    size: hire.size,
    sectorId: hire.sectorId,
    industryId: hire.industryId,
    type: hire.type,
    hideLocation: hire.hideLocation,
    countryId: hire.countryId,
    website: hire.website,
    taxRegNumber: hire.taxRegNumber,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.NAME")})),
    size: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.SIZE")}))
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.SIZE")})),
    sectorId: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.SECTOR")}))
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.SECTOR")})),
    industryId: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.INDUSTRY")}))
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.INDUSTRY")})),
    type: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.TYPE")})),
    countryId: Yup.number()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.LOCATION")}))
      .min(1, t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.LOCATION")})),
    // website: Yup.string()
    //   .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.WEBSITE")})),
    taxRegNumber: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.ACCOUNT.FIELDS.TAX_REG_NUMBER")})),
  });

  const loadSectors = e => {
    CoreService.getSectors()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setRawSectors(res.data);
        } else {
          setRawSectors([]);
        }
      })
      .catch(err => {
        setRawSectors([]);
      });
  };

  const loadIndustries = e => {
    CoreService.getIndustries({sectorId: formikProps.values.sectorId})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setRawIndustries(res.data);
        } else {
          setRawIndustries([]);
        }
      })
      .catch(err => {
        setRawIndustries([]);
      });
  };

  const loadCountries = e => {
    CoreService.getCountries()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setCountries(res.data);
        } else {
          setCountries([]);
        }
      })
      .catch(err => {
        setCountries([]);
      });
  };

  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);
    Service.save({...values, id: hire.id})
      .then(res => {
        setSubmitting(false);
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          const data = {
            ...auth,
            hire: {
              ...hire,
              ...res.data.hire,
            },
          };
          dispatch(authActions.successSignIn(data));
          sessionStorage.setItem(PROJECT.PERSIST_KEY, JSON.stringify(data));
          !!localStorage.getItem(PROJECT.PERSIST_KEY) && localStorage.setItem(PROJECT.PERSIST_KEY, JSON.stringify(data));
        } else {
          toast.error(res.message);
        }
      })
      .catch(err => {
        setSubmitting(false);
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
      });
  };

  const formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {values, touched, errors, setFieldValue, setValues, setTouched, setErrors, handleChange, handleBlur, isSubmitting} = formikProps;

  useEffect(e => {
    loadSectors();
    loadCountries();
  }, []);

  useMemo(e => {
    !!sectors.length && loadIndustries();
  }, [sectors.length, values.sectorId]);

  useMemo(e => {
    const items = [];
    for (let item of rawSectors) {
      items.push({
        value: item.id,
        text: item[`sector_${lang}`],
        lowercase: item[`sector_${lang}`].toLowerCase(),
      })
    }
    setSectors(items);
  }, [t, rawSectors]);

  useMemo(e => {
    const items = [];
    for (let item of rawIndustries) {
      items.push({
        value: item.id,
        text: item[`industry_${lang}`],
        lowercase: item[`industry_${lang}`].toLowerCase(),
      })
    }
    setIndustries(items);
  }, [t, rawIndustries]);

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem><Link to={routes.hire.account.main}>{t("NAVBAR.HIRE.ACCOUNT.MY_ACCOUNT")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBCard className="mt-4">
        <MDBCardBody>
          <form onSubmit={formikProps.handleSubmit} className="text-left">
          {/*<form onSubmit={formikProps.handleSubmit} className="mx-0 mx-lg-5 text-left">*/}
            <div className="mb-4">
              <h4 className="h4-responsive text-left grey-text">{pageTitle}</h4>
              <MDBRow className="mt-3 text-left">
                <MDBCol md="6">
                  <label>{t("HIRE.ACCOUNT.FIELDS.NAME")}</label>
                  <MDBInput id="name" name="name" outline
                            containerClass="my-0" value={values.name} onChange={handleChange}
                            onBlur={handleBlur}>
                    {!!touched.name && !!errors.name && <div className="text-left invalid-field">{errors.name}</div>}
                  </MDBInput>
                </MDBCol>
                <MDBCol md="6">
                  <label>{t("HIRE.ACCOUNT.FIELDS.SIZE")}</label>
                  <MDBSelect className="my-0" outline
                             selected={values.size} getValue={val => {
                    helpers.triggerChangeEvent("size", val[0])
                  }}>
                    <MDBSelectInput/>
                    <MDBSelectOptions>
                      <MDBSelectOption
                        value={COMPANY.SIZE["1"]}
                        checked={values.size === COMPANY.SIZE["1"]}>{t("COMMON.COMPANY.SIZE.1")}</MDBSelectOption>
                      <MDBSelectOption
                        value={COMPANY.SIZE["10"]}
                        checked={values.size === COMPANY.SIZE["10"]}>{t("COMMON.COMPANY.SIZE.10")}</MDBSelectOption>
                      <MDBSelectOption
                        value={COMPANY.SIZE["50"]}
                        checked={values.size === COMPANY.SIZE["50"]}>{t("COMMON.COMPANY.SIZE.50")}</MDBSelectOption>
                      <MDBSelectOption
                        value={COMPANY.SIZE["100"]}
                        checked={values.size === COMPANY.SIZE["100"]}>{t("COMMON.COMPANY.SIZE.100")}</MDBSelectOption>
                      <MDBSelectOption
                        value={COMPANY.SIZE["500"]}
                        checked={values.size === COMPANY.SIZE["500"]}>{t("COMMON.COMPANY.SIZE.500")}</MDBSelectOption>
                    </MDBSelectOptions>
                  </MDBSelect>
                  {!!touched.size && !!errors.size && <div className="text-left invalid-field2">{errors.size}</div>}
                </MDBCol>
              </MDBRow>
              <MDBRow className="mt-2 text-left">
                <MDBCol md="12">{t("HIRE.ACCOUNT.FIELDS.SECTOR_N_INDUSTRY")}</MDBCol>
                <MDBCol md="6">
                  {!!sectors.length && <Fragment>
                    <input hidden id="sectorId" value={values.sectorId} onChange={handleChange} onBlur={handleBlur}/>
                    <MDBSelect className="my-0" outline selected={values.sectorId} getValue={val => {
                      helpers.triggerChangeEvent("sectorId", val[0])
                    }}>
                      <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                      <MDBSelectOptions className="max-height-200">
                        <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")}
                                  value={sectorSearch} getValue={setSectorSearch} autoComplete="auto"/>
                        <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                        {sectors.filter(item => item.lowercase.indexOf(debouncedSectorSearch) !== -1).map((item, index) => (
                          <MDBSelectOption key={index} value={item.value}
                                           checked={values.sectorId == item.value}>{item.text}</MDBSelectOption>
                        ))}
                      </MDBSelectOptions>
                    </MDBSelect>
                    {!!touched.sectorId && !!errors.sectorId &&
                    <div className="text-left invalid-field">{errors.sectorId}</div>}
                  </Fragment>}
                </MDBCol>
                {!!industries.length && <MDBCol md="6" className="mt-3 mt-md-0">
                  <Fragment>
                    <input hidden id="industryId" value={values.industryId} onChange={handleChange} onBlur={handleBlur}/>
                    <MDBSelect className="mt-2 mt-md-0 mb-0" outline selected={values.industryId} getValue={val => {
                      helpers.triggerChangeEvent("industryId", val[0])
                    }}>
                      <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                      <MDBSelectOptions className="max-height-200">
                        <MDBInput id="selectSearchInput" data-search="true" placeHolder={t("COMMON.BUTTON.SEARCH")}
                                  value={industrySearch} getValue={setIndustrySearch} autoComplete="auto"/>
                        <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                        {industries.filter(item => item.lowercase.indexOf(debouncedIndustrySearch) !== -1).map((item, index) => (
                          <MDBSelectOption key={index} value={item.value}
                                           checked={values.industryId == item.value}>{item.text}</MDBSelectOption>
                        ))}
                      </MDBSelectOptions>
                    </MDBSelect>
                    {!!touched.industryId && !!errors.industryId &&
                    <div className="text-left invalid-field">{errors.industryId}</div>}
                  </Fragment>
                </MDBCol>}
              </MDBRow>
              <MDBRow className="mt-3 text-left">
                <MDBCol md="6">
                  <label>{t("HIRE.ACCOUNT.FIELDS.TYPE")}</label>
                  <input hidden id="type" value={values.type} onChange={handleChange} onBlur={handleBlur}/>
                  <MDBSelect className="my-0" outline
                             selected={values.type} getValue={val => {
                    helpers.triggerChangeEvent("type", val[0])
                  }}>
                    <MDBSelectInput/>
                    <MDBSelectOptions>
                      <MDBSelectOption
                        value={COMPANY.TYPE.PUBLIC}
                        checked={values.type === COMPANY.TYPE.PUBLIC}>{t("COMMON.COMPANY.TYPE.PUBLIC")}</MDBSelectOption>
                      <MDBSelectOption
                        value={COMPANY.TYPE.PRIVATE}
                        checked={values.type === COMPANY.TYPE.PRIVATE}>{t("COMMON.COMPANY.TYPE.PRIVATE")}</MDBSelectOption>
                      <MDBSelectOption
                        value={COMPANY.TYPE.NON_PROFIT}
                        checked={values.type === COMPANY.TYPE.NON_PROFIT}>{t("COMMON.COMPANY.TYPE.NON_PROFIT")}</MDBSelectOption>
                      <MDBSelectOption
                        value={COMPANY.TYPE.AGENCY}
                        checked={values.type === COMPANY.TYPE.AGENCY}>{t("COMMON.COMPANY.TYPE.AGENCY")}</MDBSelectOption>
                    </MDBSelectOptions>
                  </MDBSelect>
                  {!!touched.type && !!errors.type && <div className="text-left invalid-field2">{errors.type}</div>}
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md="6" className="mt-3 text-left">
                  {!!countries.length && <Fragment>
                    <label>{t("HIRE.ACCOUNT.FIELDS.LOCATION")}</label>
                    <input hidden id="countryId" value={values.countryId} onChange={handleChange} onBlur={handleBlur}/>
                    <MDBSelect className="my-0" outline selected={values.countryId} getValue={val => {
                      helpers.triggerChangeEvent("countryId", val[0])
                    }}>
                      <MDBSelectInput selected={t("COMMON.VALUES.SELECT_ONE")}/>
                      <MDBSelectOptions className="max-height-200">
                        <MDBSelectOption disabled>{t("COMMON.VALUES.SELECT_ONE")}</MDBSelectOption>
                        {countries.map((item, index) => (
                          <MDBSelectOption key={index} value={item.id}
                                           checked={values.countryId == item.id}>{item[`country_${lang}`]}</MDBSelectOption>
                        ))}
                      </MDBSelectOptions>
                    </MDBSelect>
                    {!!touched.countryId && !!errors.countryId &&
                    <div className="text-left invalid-field">{errors.countryId}</div>}
                  </Fragment>}
                </MDBCol>
                <MDBCol md="6" className="mt-3 mt-md-2 text-left">
                  <MDBInput onChange={handleChange} checked={values.hideLocation || false}
                            label={t("HIRE.ACCOUNT.FIELDS.HIDE_LOCATION")} type="checkbox" filled id="hideLocation"
                            containerClass="mt-0 mt-md-5"/>
                </MDBCol>
              </MDBRow>
              <MDBRow className="mt-3 text-left">
                <MDBCol md="6">
                  <label>{t("HIRE.ACCOUNT.FIELDS.WEBSITE")}</label>
                  <MDBInput id="website" name="website" outline
                            containerClass="my-0" value={values.website} onChange={handleChange}
                            onBlur={handleBlur}>
                    {!!touched.website && !!errors.website && <div className="text-left invalid-field">{errors.website}</div>}
                  </MDBInput>
                </MDBCol>
                <MDBCol md="6" className="mt-3 mt-md-0">
                  <label>{t("HIRE.ACCOUNT.FIELDS.TAX_REG_NUMBER")}</label>
                  <MDBInput id="taxRegNumber" name="taxRegNumber" outline
                            containerClass="my-0" value={values.taxRegNumber} onChange={handleChange}
                            onBlur={handleBlur}>
                    {!!touched.taxRegNumber && !!errors.taxRegNumber && <div className="text-left invalid-field">{errors.taxRegNumber}</div>}
                  </MDBInput>
                </MDBCol>
              </MDBRow>
            </div>

            <div className="text-center mt-4 mb-3">
              <MDBBtn type="submit" color="primary" size="sm" rounded className="z-depth-1a"
                      disabled={!!isSubmitting}>
                {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
                {!isSubmitting && t("COMMON.BUTTON.SAVE")}
              </MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </Fragment>
  );

  return payload();
}