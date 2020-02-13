import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  contactUs: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.contact.us, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  consultants: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.contact.consultants, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
