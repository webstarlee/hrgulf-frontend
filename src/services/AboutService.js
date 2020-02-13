import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  loadAboutUs: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.about.loadAboutUs, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
