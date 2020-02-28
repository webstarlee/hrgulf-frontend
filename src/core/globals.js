const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const origin = isDev ? "http://localhost:3000" : "https://recruitment.hrgulf.org";

export const PROJECT = {
  IS_DEV: isDev,
  PERSIST_KEY: "recruitment",
};

export const ACCOUNT = {
  TYPE: {
    HIRE: "HIRE",
    WORK: "WORK",
  },
};

export const ALERT = {
  SUCCESS: "success",
  DANGER: "danger",
  LIFETIME: 5000,
};

export const AUTH = {
  CURRENT_USER: "CURRENT_USER",
  TOKEN: "TOKEN",
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 6,
  GOOGLE: {
    CLIENT_ID: "683686646896-f51v2as3duadph9sat15d166ru5ps8kf.apps.googleusercontent.com",
    REDIRECT_URI: {
      SIGN_IN: `${origin}/auth/sign-in/google`,
      SIGN_UP: `${origin}/auth/sign-up/google`,
    },
  },
  FACEBOOK: {
    APP_ID: "896615737461345",
  },
};

export const AVATAR = {
  SIZE: {
    WIDTH: 200,
    HEIGHT: 200,
  },
};

export const COMPANY = {
  SIZE: {
    1: 1,
    10: 10,
    50: 50,
    100: 100,
    500: 500,
  },
  TYPE: {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
    NON_PROFIT: "NON_PROFIT",
    AGENCY: "AGENCY",
  },
};

export const CONTACT = {
  PHONE: "011-2304705",
  CONTACT_MOBILE: "+966 56 665 5007",
  CONTACT_EMAIL: "PM@eliteresources.co",
  CONTACT_WEBSITE: "www.eliteresources.co",
  CONTACT_ADDRESS: "شارع عثمان بن عفان حي الندى الرياض ص.ب 4423 - 13701 المملكة العربية السعودية",
};

export const COUNTRY = {
  CODE1: {
    BAHRAIN: "BH",
    KUWAIT: "KW",
    OMAN: "OM",
    QATAR: "QA",
    SAUDI_ARABIA: "SA",
    UAE: "AE",
  },
  CODE2: {
    BAHRAIN: "+973",
    KUWAIT: "+965",
    OMAN: "+968",
    QATAR: "+974",
    SAUDI_ARABIA: "+966",
    UAE: "+971",
  },
};

export const DATE_FORMAT = {
  ISO: "YYYY-M-D",
  ISO2: "YYYY-MM-DD",
};

export const DELAY = {
  DELAY1: 500,
  DELAY2: 1000,
  DELAY3: 1500,
};

export const DEFAULT = {
  USER: {
    EMAIL: "honey96dev@gmail.com",
    USERNAME: "honey96dev",
    PASSWORD: "123456",
    FIRST_NAME: "Zhenlong",
    FATHER_NAME: "Xuanming",
    LAST_NAME: "Jin",
    PHONE: "571623415",
    WEBSITE: "",
    NATIONALITY: "SA",
    COUNTRY: "SA",
    CITY: "Riyadh",
    BIRTHDAY: "1994-01-22",
    GENDER: "M",
  },
  COMPANY: {
    NAME: "ERC",
    LOCATION: COUNTRY.CODE1.SAUDI_ARABIA,
    SIZE: 10,
    TYPE: COMPANY.TYPE.PUBLIC,
  },
};

export const EFFECT = {
  TRANSITION_TIME: 500,
  TRANSITION_TIME5: 5000,
};

export const ERROR = {
  UNKNOWN_SERVER_ERROR: "UNKNOWN_SERVER_ERROR"
};

export const FILE_UPLOAD = {
  MAXSIZE1: "5M",
  MAXSIZE2: "10M",
};

export const GENDER = {
  MALE: "M",
  FEMALE: "F",
};

export const INPUT = {
  DESCRIPTION_LENGTH_BREAKPOINT: 400,
  TEXTAREA_ROWS1: 10,
  TEXTAREA_ROWS2: 18,
  TEXTAREA_MAX_LENGTH: 4096,
};

export const LAYOUT = {
  LISTVIEW_HEIGHT: 800,
};

export const LETTERS = {
  TYPE: {
    GENERIC: "GENERIC",
    INTERVIEW: "INTERVIEW",
    FOLLOWUP: "FOLLOWUP",
    ACCEPTANCE: "ACCEPTANCE",
    REJECTION: "REJECTION",
    ON_BOARDING: "ON_BOARDING",
  },
};

export const NAVBAR = {
  SCROLLING_OFFSET: 40,
  AVATAR: {
    HEIGHT: 35,
  },
};

export const QUESTIONNAIRE = {
  QUESTION: {
    TYPE: {
      YES_NO: "YES_NO",
      SELECT: "SELECT",
      TEXT: "TEXT",
    },
  },
  ANSWER: {
    YES: "YES",
    NO: "NO",
  },
};

export const PAGINATION = {
  WIDTH: 10,
  WIDTH_MOBILE: 6,
};

export const RESULT = {
  SUCCESS: "success",
  ERROR: "danger",
};

export const SOCIAL = {
  NAME: {
    GOOGLE: "Google",
    FACEBOOK: "Facebook",
  },
  LINKS: {
    TWITTER: "https://twitter.com/elite_resources",
    YOUTUBE: "https://www.youtube.com/channel/UCQdmdXSNkSJoZOwimDxz61g",
    LINKEDIN: "https://www.linkedin.com/company/elite-resources-center",
    SNAPCHAT: "https://www.snapchat.com/add/g_chcs",
    WHATSAPP: "https://iwtsp.com/966566655007",
  },
};

export const SCOPE = {
  ALL: "ALL",
  CURRENT: "CURRENT",
};

export const STATUS = {
  UNKNOWN: "unknown",
};

export const VALIDATION = {
  REQUIRED: "REQUIRED",
  INVALID: "INVALID",
  MAX_LENGTH: "MAX_LENGTH",
  MIN_LENGTH: "MIN_LENGTH",
  MISMATCH: "MISMATCH",
};

export default {
  PROJECT,
  ALERT,
  AUTH,
  COMPANY,
  CONTACT,
  DATE_FORMAT,
  DEFAULT,
  EFFECT,
  ERROR,
  FILE_UPLOAD,
  GENDER,
  INPUT,
  LETTERS,
  NAVBAR,
  PAGINATION,
  RESULT,
  SOCIAL,
  SCOPE,
  VALIDATION,
};
