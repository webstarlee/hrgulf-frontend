import {MINIFIED_PROFILE} from "./minified-profile.type";

export default {
  resetAll: (payload) => {
    return {type: MINIFIED_PROFILE.RESET_ALL, payload}
  },
  setStep: (payload) => {
    return {type: MINIFIED_PROFILE.SET_STEP, payload}
  },
  setValues: (payload) => {
    return {type: MINIFIED_PROFILE.SET_VALUES, payload}
  },
};
