import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  list: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.workplace.questionnaire.list, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  save: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.workplace.questionnaire.save, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  get: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.workplace.questionnaire.get, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  delete: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.workplace.questionnaire.delete, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
