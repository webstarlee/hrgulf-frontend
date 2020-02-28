import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";
import {RESULT,} from "core/globals";
import helpers from "core/helpers";

export default {
  // signIn: (params) => {
  //   return new Promise((resolve, reject) => {
  //     fetch(POST, apis.hire.auth.signIn, params)
  //       .then(res => {
  //         if (res.result === RESULT.SUCCESS) {
  //           helpers.onSuccessSignIn(params, res);
  //         }
  //         resolve(res);
  //       }, err => {
  //         reject(err);
  //       });
  //   });
  // },

  signUp: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.auth.signUp, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
