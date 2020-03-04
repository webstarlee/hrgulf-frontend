import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  getJobRoles: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getJobRoles, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getJobSubroles: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getJobSubroles, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getSectors: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getSectors, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getIndustries: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getIndustries, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getCountries: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getCountries, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getCities: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getCities, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getEmploymentTypes: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getEmploymentTypes, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getSalaryRanges: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getSalaryRanges, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getCareerLevels: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getCareerLevels, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getMajors: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getMajors, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  getDegrees: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.core.getDegrees, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
