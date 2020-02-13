import React, {Fragment, useEffect, useState} from "react";
import {
  MDBAlert,
  MDBBtn,
  MDBCol,
  MDBDatePicker,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions
} from "mdbreact";
import {CSSTransition} from "react-transition-group";
import {useTranslation} from "react-i18next";
import {sprintf} from "sprintf-js";
import {useDispatch, useSelector} from "react-redux";

import {ALERT, AUTH, COUNTRY_CODE, DATE_FORMAT, EFFECT, GENDER, PROJECT, RESULT,} from "core/globals";
import validators from "core/validators";
import authActions from "actions/auth";
import ProfileService from "services/ProfileService";

import "./PersonalInfo.scss";

export default () => {
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [editing, setEditing] = useState(false);

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [sector, setSector] = useState("");
  const [company, setCompany] = useState("");
  // const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState(PROJECT.IS_DEV ? COUNTRY_CODE.SAUDI_ARABIA : "");
  const [phone, setPhone] = useState("");

  const birthday1 = birthday ? sprintf("%04d-%02d-%02d", birthday.getFullYear(), birthday.getMonth() + 1, birthday.getDate()) : "";

  useEffect(e => {
    map2State();
  }, [auth]);

  const map2State = () => {
    setId(auth.user.id);
    setEmail(auth.user.email);
    setUsername(auth.user.username);
    setFirstName(auth.user.firstName);
    setLastName(auth.user.lastName);
    setFatherName(auth.user.fatherName);
    setGender(auth.user.gender);
    setBirthday(new Date(auth.user.birthday));
    setJobTitle(auth.user.jobTitle);
    setSector(auth.user.sector);
    setCompany(auth.user.company);
    setCity(auth.user.city);
    setCountryCode(auth.user.countryCode);
    setPhone(auth.user.phone);
  };

  const handleToggleEdit = e => {
    editing && map2State();
    setEditing(!editing);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const params = {
      id,
      email,
      username,
      firstName,
      fatherName,
      lastName,
      gender,
      birthday: birthday1,
      jobTitle,
      sector,
      company,
      city,
      countryCode,
      phone
    };
    ProfileService.save(params)
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          dispatch(authActions.successSignIn(res.data));
        }
        const authData = JSON.stringify({
          signedIn: true,
          user: res.data.user,
          token: res.data.token,
        });
        sessionStorage.setItem(PROJECT.PERSIST_KEY, authData);
        !!localStorage.getItem(PROJECT.PERSIST_KEY) && localStorage.setItem(PROJECT.PERSIST_KEY, authData);
        setAlert({
          show: true,
          color: res.result,
          message: res.message,
        });
        setEditing(false);
      })
      .catch(err => {
        setAlert({
          show: true,
          color: ALERT.DANGER,
          message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
        });
      });
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <div className="grey-text">
          <MDBRow>
            <MDBCol md={6}>
              <MDBInput id="email" name="email" type="email" label={t("AUTH.EMAIL")} disabled={!editing}
                        outline={editing} background={!editing} containerClass="mb-0" value={email} getValue={setEmail}
                        onBlur={() => setTouched(Object.assign({}, touched, {email: true}))}>
                {touched.email && !validators.isEmail(email) && <div className="invalid-field">
                  {email.length === 0 ? t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.EMAIL")}) : !validators.isEmail(email) ? t("COMMON.VALIDATION.INVALID", {field: t("AUTH.EMAIL")}) : ""}
                </div>}
              </MDBInput>
            </MDBCol>
            <MDBCol md={6}>
              <MDBInput id="username" name="username" type="text" label={t("AUTH.USERNAME")} disabled={!editing}
                        outline={editing} background={!editing} containerClass="mb-0" value={username}
                        getValue={setUsername} onBlur={() => setTouched(Object.assign({}, touched, {username: true}))}>
                {touched.username && !validators.isUsername(username) && <div className="invalid-field">
                  {username.length === 0 ? t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.USERNAME")}) : username.length > AUTH.USERNAME_MAX_LENGTH ? t("COMMON.VALIDATION.MAX_LENGTH", {
                    field: t("AUTH.USERNAME"),
                    length: AUTH.USERNAME_MAX_LENGTH
                  }) : !validators.isUsername(username) ? t("COMMON.VALIDATION.INVALID", {field: t("AUTH.USERNAME")}) : ""}
                </div>}
              </MDBInput>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md={6}>
              <MDBInput id="firstName" name="firstName" type="text" label={t("AUTH.FIRST_NAME")} disabled={!editing}
                        outline={editing} background={!editing} containerClass="mt-3 mb-0" value={firstName}
                        getValue={setFirstName}
                        onBlur={() => setTouched(Object.assign({}, touched, {firstName: true}))}>
                {touched.firstName && firstName.length === 0 && <div className="invalid-field">
                  {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FIRST_NAME")})}
                </div>}
              </MDBInput>
            </MDBCol>
            <MDBCol md={6}>
              <MDBInput id="fatherName" name="fatherName" type="text" label={t("AUTH.FATHER_NAME")} disabled={!editing}
                        outline={editing} background={!editing} containerClass="mt-3 mb-0" value={fatherName}
                        getValue={setFatherName}
                        onBlur={() => setTouched(Object.assign({}, touched, {fatherName: true}))}>
                {touched.fatherName && fatherName.length === 0 && <div className="invalid-field">
                  {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.FATHER_NAME")})}
                </div>}
              </MDBInput>
            </MDBCol>
            <MDBCol md={6}>
              <MDBInput id="lastName" name="lastName" type="text" label={t("AUTH.LAST_NAME")} disabled={!editing}
                        outline={editing} background={!editing} containerClass="mt-3 mb-0" value={lastName}
                        getValue={setLastName} onBlur={() => setTouched(Object.assign({}, touched, {lastName: true}))}>
                {touched.lastName && lastName.length === 0 && <div className="invalid-field">
                  {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.LAST_NAME")})}
                </div>}
              </MDBInput>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md={6}>
              {!!editing && <MDBSelect label={t("AUTH.GENDER")} className="mt-3 mb-0" selected={[gender]}
                                       getValue={val => setGender(val[0])}>
                <MDBSelectInput selected={[gender]}/>
                <MDBSelectOptions>
                  <MDBSelectOption value={GENDER.MALE}
                                   checked={gender === GENDER.MALE}>{t("COMMON.GENDER.MALE")}</MDBSelectOption>
                  <MDBSelectOption value={GENDER.FEMALE}
                                   checked={gender === GENDER.FEMALE}>{t("COMMON.GENDER.FEMALE")}</MDBSelectOption>
                </MDBSelectOptions>
              </MDBSelect>}
              {!editing && <MDBInput label={t("AUTH.GENDER")} disabled background
                                     value={!!gender ? gender === GENDER.MALE ? t("COMMON.GENDER.MALE") : t("COMMON.GENDER.FEMALE") : ""}/>}
              {!!gender && gender.length === 0 && <div className="invalid-field">
                {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.GENDER")})}
              </div>}
            </MDBCol>
            <MDBCol md={6}>
              {!!editing && <Fragment>
                <MDBDatePicker format={DATE_FORMAT.ISO} autoOk keyboard disabled={!editing} className="date-picker"
                               value={birthday} getValue={val => setBirthday(val)}/>
                <label className="date-picker-label">{t("AUTH.BIRTHDAY")}</label>
              </Fragment>}
              {/*{!!editing && <MDBDatePicker format={DATE_FORMAT_ISO} className="date-picker" value={birthday} getValue={val => setBirthday(val)} />}*/}
              {!editing && <MDBInput label={t("AUTH.BIRTHDAY")} disabled background value={birthday1}/>}
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md={6}>
              <MDBInput id="jobTitle" name="jobTitle" type="text" label={t("AUTH.JOB_TITLE")} disabled={!editing}
                        outline={editing} background={!editing} containerClass="mt-3 mb-0" value={jobTitle}
                        getValue={setJobTitle} onBlur={() => setTouched(Object.assign({}, touched, {jobTitle: true}))}>
                {touched.jobTitle && jobTitle.length === 0 && <div className="invalid-field">
                  {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.JOB_TITLE")})}
                </div>}
              </MDBInput>
            </MDBCol>
            <MDBCol md={6}>
              <MDBInput id="sector" name="sector" type="text" label={t("AUTH.SECTOR")} disabled={!editing}
                        outline={editing} background={!editing} containerClass="mt-3 mb-0" value={sector}
                        getValue={setSector} onBlur={() => setTouched(Object.assign({}, touched, {sector: true}))}>
                {touched.sector && sector.length === 0 && <div className="invalid-field">
                  {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.SECTOR")})}
                </div>}
              </MDBInput>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md={6}>
              <MDBInput id="company" name="company" type="text" label={t("AUTH.COMPANY")} disabled={!editing}
                        outline={editing} background={!editing} containerClass="mt-3 mb-0" value={company}
                        getValue={setCompany} onBlur={() => setTouched(Object.assign({}, touched, {company: true}))}>
                {touched.company && company.length === 0 && <div className="invalid-field">
                  {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.COMPANY")})}
                </div>}
              </MDBInput>
            </MDBCol>
            <MDBCol md={6}>
              <MDBInput id="city" name="city" type="text" label={t("AUTH.CITY")} disabled={!editing} outline={editing}
                        background={!editing} containerClass="mt-3 mb-0" value={city} getValue={setCity}
                        onBlur={() => setTouched(Object.assign({}, touched, {city: true}))}>
                {touched.city && city.length === 0 && <div className="invalid-field">
                  {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.CITY")})}
                </div>}
              </MDBInput>
            </MDBCol>
          </MDBRow>
          <MDBRow>

            <MDBCol md={6}>
              {!!editing && <MDBSelect label={t("AUTH.COUNTRY_CODE")} className="mt-3 mb-0" selected={[countryCode]}
                                       getValue={val => setCountryCode(val[0])}>
                <MDBSelectInput selected={[countryCode]}/>
                <MDBSelectOptions>
                  <MDBSelectOption value={COUNTRY_CODE.BAHRAIN}
                                   checked={countryCode === COUNTRY_CODE.BAHRAIN}>{COUNTRY_CODE.BAHRAIN} - {t("COMMON.GCC_COUNTRIES.BAHRAIN")}</MDBSelectOption>
                  <MDBSelectOption value={COUNTRY_CODE.KUWAIT}
                                   checked={countryCode === COUNTRY_CODE.KUWAIT}>{COUNTRY_CODE.KUWAIT} - {t("COMMON.GCC_COUNTRIES.KUWAIT")}</MDBSelectOption>
                  <MDBSelectOption value={COUNTRY_CODE.OMAN}
                                   checked={countryCode === COUNTRY_CODE.OMAN}>{COUNTRY_CODE.OMAN} - {t("COMMON.GCC_COUNTRIES.OMAN")}</MDBSelectOption>
                  <MDBSelectOption value={COUNTRY_CODE.QATAR}
                                   checked={countryCode === COUNTRY_CODE.QATAR}>{COUNTRY_CODE.QATAR} - {t("COMMON.GCC_COUNTRIES.QATAR")}</MDBSelectOption>
                  <MDBSelectOption value={COUNTRY_CODE.SAUDI_ARABIA}
                                   checked={countryCode === COUNTRY_CODE.SAUDI_ARABIA}>{COUNTRY_CODE.SAUDI_ARABIA} - {t("COMMON.GCC_COUNTRIES.SAUDI_ARABIA")}</MDBSelectOption>
                  <MDBSelectOption value={COUNTRY_CODE.UAE}
                                   checked={countryCode === COUNTRY_CODE.UAE}>{COUNTRY_CODE.UAE} - {t("COMMON.GCC_COUNTRIES.UAE")}</MDBSelectOption>
                </MDBSelectOptions>
              </MDBSelect>}
              {!editing && <MDBInput label={t("AUTH.COUNTRY_CODE")} disabled background value={countryCode}/>}
              {!editing && !!countryCode && countryCode.length === 0 && <div className="text-left invalid-field">
                {t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.COUNTRY_CODE")})}
              </div>}
            </MDBCol>
            <MDBCol md={6}>
              <MDBInput id="phone" name="phone" type="text" label={t("AUTH.PHONE")} disabled={!editing}
                        outline={editing} background={!editing} value={phone} getValue={setPhone}
                        onBlur={() => setTouched(Object.assign({}, touched, {phone: true}))}>
                {(!!countryCode.length || touched.phone) && (phone.length === 0 || !validators.isPhoneNumber(`${countryCode}${phone}`)) &&
                <div className="text-left invalid-field">
                  {!phone.length ? t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PHONE")}) : t("COMMON.VALIDATION.INVALID", {field: t("AUTH.PHONE")})}
                </div>}
              </MDBInput>
            </MDBCol>
          </MDBRow>
        </div>
        <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>
          <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
        </CSSTransition>
        {!!editing && <div className="mt-4 mb-3 text-left">
          <MDBBtn type="submit" color="indigo" className="z-depth-1a"
                  disabled={loading || !validators.isEmail(email) || !username.length || username.length > AUTH.USERNAME_MAX_LENGTH || !validators.isUsername(username) || !firstName.length || !fatherName.length || !lastName.length || !gender.length || !jobTitle.length || !sector.length || !company.length || !city.length || !countryCode.length || !phone.length || !validators.isPhoneNumber(`${countryCode}${phone}`)}>
            {!loading && <MDBIcon icon={"save"}/>}
            {!!loading && <div className="spinner-grow spinner-grow-sm" role="status"/>}
            {t("COMMON.BUTTON.SAVE")}
          </MDBBtn>
          <MDBBtn type="button" color="danger" className="z-depth-1a" onClick={handleToggleEdit}>
            <MDBIcon icon={"times"}/>{t("COMMON.BUTTON.CANCEL")}
          </MDBBtn>
        </div>}
        {!editing && <div className="mt-4 mb-3 text-left">
          <MDBBtn type="button" color="indigo" className="z-depth-1a" onClick={handleToggleEdit}>
            <MDBIcon icon={"edit"}/>{t("COMMON.BUTTON.MODIFY")}
          </MDBBtn>
        </div>}
      </form>
    </Fragment>
  );
}
