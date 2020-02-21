import fetch from "apis/fetch";
import {POST} from "apis/constants";
import apis from "core/apis";

export default {
  loadSalary: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.loadSalary, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  saveSalary: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.saveSalary, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  loadAbout: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.loadAbout, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  saveAbout: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.saveAbout, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  loadVision: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.loadVision, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  saveVision: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.saveVision, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  loadMission: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.loadMission, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  saveMission: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.saveMission, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  loadCoverPhoto: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.loadCoverPhoto, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },

  saveCoverPhoto: (params) => {
    return new Promise((resolve, reject) => {
      fetch(POST, apis.hire.myCompanyProfiles.saveCoverPhoto, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  },
};
