import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  listRoles: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.work.findJobs.jobsByRole.listRoles, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  list: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.work.findJobs.jobsByRole.list, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
