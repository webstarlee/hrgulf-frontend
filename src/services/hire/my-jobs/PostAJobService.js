import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  postJob: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myJobs.postAJob.postJob, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
