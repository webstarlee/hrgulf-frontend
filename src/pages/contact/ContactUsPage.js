import React, {Fragment, useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {CSSTransition} from "react-transition-group";
import {MDBAlert, MDBBtn, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow} from "mdbreact";

import {
  ALERT, CONTACT, PROJECT, RESULT, INPUT, EFFECT, DEFAULT,
} from "core/globals";
import validators from "core/validators";
import Service from "services/ContactService";

import "./ContactUsPage.scss";

export default () => {
  const {t} = useTranslation();


  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [name, setName] = useState(PROJECT.IS_DEV ? DEFAULT.USERNAME : "");
  const [email, setEmail] = useState(PROJECT.IS_DEV ? DEFAULT.EMAIL : "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(e => {
  }, [t]);

  const handleSubmit = e => {
    e.preventDefault();

    setLoading(true);
    Service.contactUs({name, email, subject, message})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setTouched({});
          setName("");
          setEmail("");
          setSubject("");
          setMessage("");
        }
        setAlert({
          show: true,
          color: res.result,
          message: res.message,
        });
        setLoading(false);
      })
      .catch(err => {
        setAlert({
          show: true,
          color: RESULT.DANGER,
          message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
        });
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <Helmet>
        <title>{t("CONTACT.US.TITLE")} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBContainer className="section">
        <MDBRow>
          <MDBCol md={12}>
            <h2 className="heading1 text-center font-weight-bold mb-5">{t("CONTACT.US.TITLE")}</h2>
            <h5 className="heading2 text-center description-message">{t("CONTACT.US.DESCRIPTION1")}</h5>
            <h5 className="heading2 text-center description-message">{t("CONTACT.US.DESCRIPTION2")}</h5>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mt-5">
          <MDBCol md={7}>
            <form onSubmit={handleSubmit} className="pr-lg-4">
              <div className="grey-text">
                <MDBRow>
                  <MDBCol md={6}>
                    <MDBInput id="name" name="name" type="text" label={t("CONTACT.US.NAME")} outline value={name}
                              getValue={setName} onBlur={() => setTouched(Object.assign({}, touched, {name: true}))}>
                      {touched.name && !name.length && <div className="invalid-field">
                        {t("COMMON.VALIDATION.REQUIRED", {field: t("CONTACT.US.NAME")})}
                      </div>}
                    </MDBInput>
                  </MDBCol>
                  <MDBCol md={6}>
                    <MDBInput id="email" name="email" type="email" label={t("CONTACT.US.EMAIL")} outline value={email}
                              getValue={setEmail} onBlur={() => setTouched(Object.assign({}, touched, {email: true}))}>
                      {touched.email && !validators.isEmail(email) && <div className="invalid-field">
                        {email.length === 0 ? t("COMMON.VALIDATION.REQUIRED", {field: t("CONTACT.US.EMAIL")}) : !validators.isEmail(email) ? t("COMMON.VALIDATION.INVALID", {field: t("CONTACT.US.EMAIL")}) : ""}
                      </div>}
                    </MDBInput>
                  </MDBCol>
                  <MDBCol md={12}>
                    <MDBInput id="subject" name="subject" type="text" label={t("CONTACT.US.SUBJECT")} outline value={subject}
                              getValue={setSubject} onBlur={() => setTouched(Object.assign({}, touched, {subject: true}))}>
                      {touched.subject && !subject.length && <div className="invalid-field">
                        {t("COMMON.VALIDATION.REQUIRED", {field: t("CONTACT.US.SUBJECT")})}
                      </div>}
                    </MDBInput>
                  </MDBCol>
                  <MDBCol md={12}>
                    <MDBInput id="message" name="message" type="textarea" rows={INPUT.TEXTAREA_ROWS1} label={t("CONTACT.US.MESSAGE")} outline value={message}
                              getValue={setMessage} onBlur={() => setTouched(Object.assign({}, touched, {message: true}))}>
                      {touched.message && !message.length && <div className="invalid-field">
                        {t("COMMON.VALIDATION.REQUIRED", {field: t("CONTACT.US.MESSAGE")})}
                      </div>}
                    </MDBInput>
                  </MDBCol>
                </MDBRow>
              </div>
              <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>
                <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
              </CSSTransition>
              <div className="text-left mb-3">
                <MDBBtn type="submit" color="indigo" rounded className="z-depth-1a"
                        disabled={loading || !name.length || !validators.isEmail(email) || !subject.length || !message.length}>
                  {t("COMMON.BUTTON.SEND")}
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
          <MDBCol md={5} className="mt-3" dir="ltr">
            <div className="mb-5">
              <MDBIcon icon="phone-office" className="contact-icon mr-4-f"/>
              <span className="contact-item">{CONTACT.PHONE}</span>
            </div>
            <div className="mb-5">
              <MDBIcon icon="phone" className="contact-icon mr-4-f"/>
              <span className="contact-item">{CONTACT.MOBILE}</span>
            </div>
            <div className="mb-5">
              <MDBIcon icon="envelope" className="contact-icon mr-4-f"/>
              <span className="contact-item">{CONTACT.EMAIL}</span>
            </div>
            <div className="mb-5">
              <MDBIcon icon="globe" className="contact-icon mr-4-f"/>
              <span className="contact-item">{CONTACT.WEBSITE}</span>
            </div>
            <div className="mb-5">
              <MDBIcon icon="map-marker-alt" className="contact-icon mr-4-f"/>
              <span className="contact-item">{CONTACT.ADDRESS}</span>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      {/*<Loader />*/}
    </Fragment>
  );
}
