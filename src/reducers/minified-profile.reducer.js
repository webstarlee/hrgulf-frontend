import {MINIFIED_PROFILE} from "actions/minified-profile.type";

const initialState = {
  step: 1,
  pendingStep: 1,

  // step: 4,
  // pendingStep: 4,

  jobRoleId: 0,
  jobTitle: "",
  companyName: "",
  startDate: new Date().toDateString(),
  endDate: new Date().toDateString(),
  isPresent: 0,
  jobLocationId: 0,
  companySectorId: 0,
  companyIndustryId: 0,
  jobVisaStatusId: 0,
  careerLevel: 0,
  university: "",
  majorId: "",
  graduatedDate: "",
  gradeId: "",
  birthday: "",
  gender: "",
  nationalityId: "",
  countryId: "",
  cityId: "",
  visaStatusId: "",
};

export default (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case MINIFIED_PROFILE.RESET_ALL:
      return {
        ...initialState,
      };
    case MINIFIED_PROFILE.SET_STEP:
      return {
        ...state,
        ...payload,
      };
    case MINIFIED_PROFILE.SET_VALUES:
      return {
        ...state,
        ...payload,
      };
    default:
      return state
  }
};
