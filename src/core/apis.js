import {PROJECT} from "core/globals";

export default {
  baseUrl: PROJECT.IS_DEV ? "http://localhost:7080/api/" : "/api/",
  assetsBaseUrl: PROJECT.IS_DEV ? "http://localhost:7080/assets/" : "/assets/",
  auth: {
    signIn: "auth/sign-in",
    signUp: "auth/sign-up",
    validateGoogleAccount: "auth/validate-google-account",
    signInWithGoogle: "auth/sign-in-with-google",
    validateFacebookAccount: "auth/validate-facebook-account",
    signInWithFacebook: "auth/sign-in-with-facebook",
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
    letters: {
      list: "hire/letters/list",
      save: "hire/letters/save",
      get: "hire/letters/get",
      delete: "hire/letters/delete",
    },
  },
  work: {

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
