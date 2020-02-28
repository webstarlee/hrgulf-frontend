import fetch, {setHeader} from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";
import {PROJECT, RESULT,} from "core/globals";
import helpers from "core/helpers";

export default {
  signIn: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.signIn, params)
        .then(res => {
          if (res.result === RESULT.SUCCESS) {
            helpers.onSuccessSignIn(params, res);
          }
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  signOut: params => {
    setHeader({Authorization: null});
    sessionStorage.removeItem(PROJECT.PERSIST_KEY);
    localStorage.removeItem(PROJECT.PERSIST_KEY);
  },

  sendForgotPasswordMail: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.sendForgotPasswordMail, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  validateToken: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.validateToken, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  resetPassword: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.resetPassword, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
