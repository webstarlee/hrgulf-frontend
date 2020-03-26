import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  listLocations: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.work.findJobs.jobsByLocation.listLocations, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  list: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.work.findJobs.jobsByLocation.list, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
