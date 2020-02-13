import fetch, {setHeader} from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";
import {SUCCESS} from "core/globals";

export default {
  avatar: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.profile.avatar, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  saveAvatar: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.profile.saveAvatar, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  save: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.profile.save, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  changePassword: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.profile.changePassword, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
