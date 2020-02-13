import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  packages: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.questionnaire.packages, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getPackage: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.questionnaire.getPackage, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  questions: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.questionnaire.questions, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  update: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.questionnaire.update, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  result: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.questionnaire.result, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
