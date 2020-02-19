import {
  AUTH_REDIRECT_URL_SIGNAL,
  AUTH_SIGN_IN_FAILURE_SIGNAL,
  AUTH_SIGN_IN_REQUEST_SIGNAL,
  AUTH_SIGN_IN_SUCCESS_SIGNAL,
  AUTH_SIGN_OUT_SIGNAL
} from "actions/auth.type";
import {PROJECT} from "core/globals";

const authStorage = localStorage.getItem(PROJECT.PERSIST_KEY);
let authSession = !!authStorage ? authStorage : sessionStorage.getItem(PROJECT.PERSIST_KEY);
authSession = !!authSession ? JSON.parse(authSession) : undefined;

const initialState = {
  signedIn: !!authSession ? authSession.signedIn : false,
  account: !!authSession ? authSession.account : false,
  user: !!authSession ? authSession.user : undefined,
  token: !!authSession ? authSession.token : undefined,
  redirectUrl: null,
};

export default (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case AUTH_SIGN_IN_REQUEST_SIGNAL:
      return {
        ...state,
        signedIn: false,
        user: null,
        account: null,
        token: null,
      };
    case AUTH_SIGN_IN_SUCCESS_SIGNAL:
      return {
        ...state,
        signedIn: true,
        user: payload.user,
        account: payload.account,
        token: payload.token,
      };
    case AUTH_SIGN_IN_FAILURE_SIGNAL:
      return {
        ...state,
        signedIn: false,
        user: null,
        account: null,
        token: null,
      };
    case AUTH_SIGN_OUT_SIGNAL:
      return {
        ...state,
        signedIn: false,
        user: null,
        account: null,
        token: null,
        redirectUrl: "",
      };
    case AUTH_REDIRECT_URL_SIGNAL:
      return {
        ...state,
        redirectUrl: payload,
      };
    default:
      return state
  }
};
