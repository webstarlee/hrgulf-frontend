import fetch, {setHeader} from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";
import {PROJECT, RESULT,} from "core/globals";

export default {
  signIn: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.signIn, params)
        .then(res => {
          if (res.result === RESULT.SUCCESS) {
            setHeader({Authorization: `Bearer ${res.data.token}`});
            const authData = JSON.stringify({
              signedIn: true,
              user: res.data.user,
              token: res.data.token,
            });
            params["rememberMe"] && localStorage.setItem(PROJECT.PERSIST_KEY, authData);
          }
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  signUp: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.signUp, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  validateGoogleAccount: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.validateGoogleAccount, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  signInWithGoogle: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.signInWithGoogle, params)
        .then(res => {
          if (res.result === RESULT.SUCCESS) {
            setHeader({Authorization: `Bearer ${res.data.token}`});
            const authData = JSON.stringify({
              signedIn: true,
              user: res.data.user,
              token: res.data.token,
            });
            params["rememberMe"] && localStorage.setItem(PROJECT.PERSIST_KEY, authData);
          }
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  validateFacebookAccount: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.validateFacebookAccount, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  signInWithFacebook: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.signInWithFacebook, params)
        .then(res => {
          if (res.result === RESULT.SUCCESS) {
            setHeader({Authorization: `Bearer ${res.data.token}`});
            const authData = JSON.stringify({
              signedIn: true,
              user: res.data.user,
              token: res.data.token,
            });
            params["rememberMe"] && localStorage.setItem(PROJECT.PERSIST_KEY, authData);
          }
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  signInWithFacebook: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.auth.signInWithFacebook, params)
        .then(res => {
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
