import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  listSectors: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.work.findJobs.jobsBySector.listSectors, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  list: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.work.findJobs.jobsBySector.list, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
