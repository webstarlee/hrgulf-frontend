import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  listCompanies: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.work.findJobs.jobsByCompanies.listCompanies, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  list: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.work.findJobs.jobsByCompanies.list, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
