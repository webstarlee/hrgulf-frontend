import {POST_A_JOB} from "./my-jobs.type";

const postAJob = {
  resetAll: (payload) => {
    return {type: POST_A_JOB.RESET_ALL, payload}
  },
  setStep: (payload) => {
    return {type: POST_A_JOB.SET_STEP, payload}
  },
  setJobInformation: (payload) => {
    return {type: POST_A_JOB.SET_JOB_INFORMATION, payload}
  },
  setCandidateRequirements: (payload) => {
    return {type: POST_A_JOB.SET_CANDIDATE_REQUIREMENTS, payload}
  },
  setSpecialties: (payload) => {
    return {type: POST_A_JOB.SET_SPECIALTIES, payload}
  },
  setQuestionnaire: (payload) => {
    return {type: POST_A_JOB.SET_QUESTIONNAIRE, payload}
  },
};

export default {
  postAJob,
};
