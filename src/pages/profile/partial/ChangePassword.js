import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MDBAlert, MDBBtn, MDBCol, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import {useTranslation} from "react-i18next";
import {animateScroll as scroll} from "react-scroll";
import {CSSTransition} from "react-transition-group";

import {ALERT, AUTH, DEFAULT, EFFECT, PROJECT} from "core/globals";
import ProfileService from "services/ProfileService";

import "./ChangePassword.scss";

export default (props) => {
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [password0, setPassword0] = useState(PROJECT.IS_DEV ? DEFAULT.PASSWORD : "");
  const [password, setPassword] = useState(PROJECT.IS_DEV ? DEFAULT.PASSWORD : "");
  const [password2, setPassword2] = useState(PROJECT.IS_DEV ? DEFAULT.PASSWORD : "");

  useEffect(() => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, [props]);

  const handleSubmit = event => {
    event.preventDefault();

    const params = {id: auth.user.id, password0, password};
    ProfileService.changePassword(params)
      .then(res => {
        setAlert({
          show: true,
          color: res.result,
          message: res.message,
        });
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
              <MDBInput id="password0" name="password0" label={t("PROFILE.PASSWORD.CURRENT_PASSWORD")} type="password"
                        outline containerClass="mt-3" value={password0} getValue={setPassword0}
                        onBlur={() => setTouched(Object.assign({}, touched, {password0: true}))}>
                {touched.password0 && password0.length < AUTH.PASSWORD_MIN_LENGTH && <div
                  className="invalid-field">{password0.length === 0 ? t("COMMON.VALIDATION.REQUIRED", {field: t("PROFILE.PASSWORD.CURRENT_PASSWORD")}) : t("COMMON.VALIDATION.MIN_LENGTH", {
                  field: t("PROFILE.PASSWORD.CURRENT_PASSWORD"), length: AUTH.PASSWORD_MIN_LENGTH
                })}</div>}
              </MDBInput>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md={6}>
              <MDBInput id="password" name="password" label={t("PROFILE.PASSWORD.NEW_PASSWORD")} type="password" outline
                        containerClass="mt-3" value={password} getValue={setPassword}
                        onBlur={() => setTouched(Object.assign({}, touched, {password: true}))}>
                {touched.password && password.length < AUTH.PASSWORD_MIN_LENGTH && <div
                  className="invalid-field">{password.length === 0 ? t("COMMON.VALIDATION.REQUIRED", {field: t("PROFILE.PASSWORD.NEW_PASSWORD")}) : t("COMMON.VALIDATION.MIN_LENGTH", {
                  field: t("PROFILE.PASSWORD.NEW_PASSWORD"), length: AUTH.PASSWORD_MIN_LENGTH
                })}</div>}
              </MDBInput>
            </MDBCol>
            <MDBCol md={6}>
              <MDBInput id="password2" name="password2" label={t("AUTH.PASSWORD2")} type="password" outline
                        containerClass="mt-3" value={password2} getValue={setPassword2}
                        onBlur={() => setTouched(Object.assign({}, touched, {password2: true}))}>
                {touched.password2 && (password2.length < AUTH.PASSWORD_MIN_LENGTH || password2 !== password) && <div
                  className="invalid-field">{password2.length === 0 ? t("COMMON.VALIDATION.REQUIRED", {field: t("AUTH.PASSWORD2")}) : password2.length < AUTH.PASSWORD_MIN_LENGTH ? t("COMMON.VALIDATION.MIN_LENGTH", {
                  field: t("AUTH.PASSWORD2"),
                  length: AUTH.PASSWORD_MIN_LENGTH
                }) : t("COMMON.VALIDATION.NOT_SAME", {field: t("AUTH.PASSWORD")})}</div>}
              </MDBInput>
            </MDBCol>
          </MDBRow>
        </div>
        <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit
                       appear>
          <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
        </CSSTransition>
        <div className="mt-4 mb-3 text-left">
          <MDBBtn type="submit" color="indigo" className="z-depth-1a"
                  disabled={loading || !password0.length || password0.length < AUTH.PASSWORD_MIN_LENGTH || !password.length || password.length < AUTH.PASSWORD_MIN_LENGTH || password2 !== password || password.length < AUTH.PASSWORD_MIN_LENGTH}>
            {!loading && <MDBIcon icon={"edit"}/>}
            {!!loading && <div className="spinner-grow spinner-grow-sm" role="status"/>}
            {t("PROFILE.PASSWORD.CHANGE_PASSWORD")}
          </MDBBtn>
        </div>
      </form>
    </Fragment>
  )
}
