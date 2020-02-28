import {PROJECT} from "core/globals";

export default {
  baseUrl: PROJECT.IS_DEV ? "http://localhost:7080/api/" : "/api/",
  assetsBaseUrl: PROJECT.IS_DEV ? "http://localhost:7080/assets/" : "/assets/",
  auth: {
    signIn: "auth/sign-in",
    sendForgotPasswordMail: "auth/send-forgot-password-mail",
    validateToken: "auth/validate-token",
    resetPassword: "auth/reset-password",
  },
  account: {
    avatar: "account/avatar",
    saveAvatar: "account/save-avatar",
    savePersonalInfo: "account/save-personal-info",
    changePassword: "account/change-password",
    changeAccountType: "account/change-account-type",
  },
  hire: {
    auth: {
      // signIn: "hire/auth/sign-in",
      signUp: "hire/auth/sign-up",
    },
    workplace : {
      questionnaire: {
        list: "hire/workplace/questionnaire/list",
        save: "hire/workplace/questionnaire/save",
        get: "hire/workplace/questionnaire/get",
        delete: "hire/workplace/questionnaire/delete",
        listQuestions: "hire/workplace/questionnaire/list-questions",
        saveQuestion: "hire/workplace/questionnaire/save-question",
        getQuestion: "hire/workplace/questionnaire/get-question",
        deleteQuestion: "hire/workplace/questionnaire/delete-question",
      },
      letters: {
        list: "hire/workplace/letters/list",
        save: "hire/workplace/letters/save",
        get: "hire/workplace/letters/get",
        delete: "hire/workplace/letters/delete",
      },
      myCompanyProfiles: {
        loadSalary: "hire/workplace/my-company-profiles/load-salary",
        saveSalary: "hire/workplace/my-company-profiles/save-salary",
        loadAbout: "hire/workplace/my-company-profiles/load-about",
        saveAbout: "hire/workplace/my-company-profiles/save-about",
        loadVision: "hire/workplace/my-company-profiles/load-vision",
        saveVision: "hire/workplace/my-company-profiles/save-vision",
        loadMission: "hire/workplace/my-company-profiles/load-mission",
        saveMission: "hire/workplace/my-company-profiles/save-mission",
        loadCoverPhoto: "hire/workplace/my-company-profiles/load-cover-photo",
        saveCoverPhoto: "hire/workplace/my-company-profiles/save-cover-photo",
      },
    }
  },
  work: {
    auth: {
      // signIn: "work/auth/sign-in",
      signUp: "work/auth/sign-up",
      validateGoogleAccount: "work/auth/validate-google-account",
      signInWithGoogle: "work/auth/sign-in-with-google",
      validateFacebookAccount: "work/auth/validate-facebook-account",
      signInWithFacebook: "work/auth/sign-in-with-facebook",
    },
  },
  profile: {
    avatar: "profile/avatar",
    saveAvatar: "profile/save-avatar",
    save: "profile/save",
    changePassword: "profile/change-password",
  },
  contact: {
    us: "contact/us",
    consultants: "contact/consultants",
    // consultants: "https://eliteresources.co/api/director-board/list",
  },
  about: {
    loadAboutUs: "about/load-aboutus",
  },
};
