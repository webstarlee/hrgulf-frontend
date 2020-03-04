import {POST_A_JOB} from "actions/my-jobs.type";
import {JOB} from "core/globals";

const initialState = {
  postAJob: {
    step: 1,
    pendingStep: 1,


    // step: 4,
    // pendingStep: 4,
    jobInformation: {
      id: null,
      candidateType: JOB.CANDIDATE.TYPE.PROFESSIONAL,
      title: "",
      jobRoleId: 0,
      jobSubroleId: 0,
      sectorId: 0,
      industryId: 0,
      countryId: 0,
      cityId: 0,
      employmentTypeId: 0,
      salaryRangeId: 0,
      vacanciesCount: 0,
      description: "",
      skills: "",


      // candidateType: 'SKILLED',
      // title: 'Web Developement',
      // jobRoleId: '1',
      // jobSubroleId: '4',
      // sectorId: '2',
      // industryId: '8',
      // countryId: '4',
      // cityId: '93',
      // employmentTypeId: '3',
      // salaryRangeId: '4',
      // vacanciesCount: '3',
      // description: '<p>sfs</p>\n',
      // skills: '<p>gasfas</p>\n',
    },
    candidateRequirements: {
      careerLevel: "0",
      xpYear1: "0",
      xpYear2: "0",
      majorId: "0",
      degree: "0",
      countryId: "0",
      cityId: "0",
      nationalityId: "0",
      gender: "U",
      age1: "0",
      age2: "0",


      // careerLevel: "2",
      // xpYear1: "2",
      // xpYear2: "6",
      // majorId: "3",
      // degree: "3",
      // countryId: "3",
      // cityId: "50",
      // nationalityId: "3",
      // gender: "U",
      // age1: "33",
      // age2: "40",
    },
    specialties: {
      specialties: [],
      // specialties: ["Test"],
    },
    questionnaire: {
      questionnaireId: "0",
    },
  },
};

export default (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case POST_A_JOB.RESET_ALL:
      return {
        ...state,
        postAJob : initialState.postAJob,
      };
    case POST_A_JOB.SET_STEP:
      return {
        ...state,
        postAJob: {
          ...state.postAJob,
          ...payload,
        },
      };
    case POST_A_JOB.SET_JOB_INFORMATION:
      return {
        ...state,
        postAJob: {
          ...state.postAJob,
          jobInformation: payload,
        },
      };
    case POST_A_JOB.SET_CANDIDATE_REQUIREMENTS:
      return {
        ...state,
        postAJob: {
          ...state.postAJob,
          candidateRequirements: payload,
        },
      };
    case POST_A_JOB.SET_SPECIALTIES:
      return {
        ...state,
        postAJob: {
          ...state.postAJob,
          specialties: payload,
        },
      };
    case POST_A_JOB.SET_QUESTIONNAIRE:
      return {
        ...state,
        postAJob: {
          ...state.postAJob,
          questionnaire: payload,
        },
      };
    default:
      return state
  }
};
