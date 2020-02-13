import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  packages: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.vote.packages, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getPackage: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.vote.getPackage, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  questions: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.vote.questions, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  update: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.vote.update, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  result: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.vote.result, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
