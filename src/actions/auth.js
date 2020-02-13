import {
  AUTH_REDIRECT_URL_SIGNAL,
  AUTH_SIGN_IN_FAILURE_SIGNAL,
  AUTH_SIGN_IN_REQUEST_SIGNAL,
  AUTH_SIGN_IN_SUCCESS_SIGNAL,
  AUTH_SIGN_OUT_SIGNAL,
  AUTH_SIGN_UP_FAILURE_SIGNAL,
  AUTH_SIGN_UP_REQUEST_SIGNAL,
  AUTH_SIGN_UP_SUCCESS_SIGNAL
} from "./auth.type";

const requestSignIn = (payload) => {
  return {type: AUTH_SIGN_IN_REQUEST_SIGNAL, payload}
};
const successSignIn = (payload) => {
  return {type: AUTH_SIGN_IN_SUCCESS_SIGNAL, payload}
};
const failureSignIn = (payload) => {
  return {type: AUTH_SIGN_IN_FAILURE_SIGNAL, payload}
};
const requestSignUp = (payload) => {
  return {type: AUTH_SIGN_UP_REQUEST_SIGNAL, payload}
};
const successSignUp = (payload) => {
  return {type: AUTH_SIGN_UP_SUCCESS_SIGNAL, payload}
};
const failureSignUp = (payload) => {
  return {type: AUTH_SIGN_UP_FAILURE_SIGNAL, payload}
};
const signOut = (payload) => {
  return {type: AUTH_SIGN_OUT_SIGNAL}
};
const setRedirectUrl = (payload) => {
  return {type: AUTH_REDIRECT_URL_SIGNAL, payload}
};

export default {
  requestSignIn,
  successSignIn,
  failureSignIn,
  requestSignUp,
  successSignUp,
  failureSignUp,
  signOut,
  setRedirectUrl,
};
