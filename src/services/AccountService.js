import fetch, {setHeader} from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";
import {SUCCESS} from "core/globals";

export default {
  avatar: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.account.avatar, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  saveAvatar: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.account.saveAvatar, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  savePersonalInfo: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.account.savePersonalInfo, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  changePassword: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.account.changePassword, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  changeAccountType: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.account.changeAccountType, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
