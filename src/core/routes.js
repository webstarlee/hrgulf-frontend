import {PROJECT} from "core/globals";

export const routes = {
  mainGateway: PROJECT.IS_DEV ? "/" : "//hrgulf.org",
  root: "/",
  admin: "/admin",
  admin2: "//admin-knowledge.hrgulf.org",
  auth: {
    root: "/auth",
    signIn: "/auth/sign-in",
    facebookSignIn: "/auth/sign-in/facebook",
    googleSignIn: "/auth/sign-in/google",
    signUp: "/auth/sign-up",
    facebookSignUp: "/auth/sign-up/facebook",
    googleSignUp: "/auth/sign-up/google",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  hire: {
    root: "/hire",
    auth: {
      root: "/hire/auth",
      signIn: "/hire/auth/sign-in",
      signUp: "/hire/auth/sign-up",
      forgotPassword: "/hire/auth/forgot-password",
      resetPassword: "/hire/auth/reset-password",
    },
    workplace: {
      root: "/hire/workplace",
      questionnaire: {
        root: "/hire/workplace/questionnaire",
        all: "/hire/workplace/questionnaire",
        add: "/hire/workplace/questionnaire/add",
        // questions: "/hire/workplace/questionnaire/questions",
        // addQuestion: "/hire/workplace/questionnaire/questions/add",
      },
      letters: {
        root: "/hire/workplace/letters",
        all: "/hire/workplace/letters",
        add: "/hire/workplace/letters/add",
      },
      myCompanyProfiles: {
        root: "/hire/workplace/my-company-profiles",
        main: "/hire/workplace/my-company-profiles",
      },
      employerTest: {
        root: "/hire/workplace/employer-test",
        main: "/hire/workplace/employer-test",
      },
    },
    myJobs: {
      root: "/hire/my-jobs",
      postAJob: {
        root: "/hire/my-jobs/post-a-job",
        main: "/hire/my-jobs/post-a-job",
        addQuestionnaire: "/hire/my-jobs/post-a-job/add-questionnaire",
      },
      myJobs: {
        root: "/hire/my-jobs/my-jobs",
        main: "/hire/my-jobs/my-jobs",
        edit: "/hire/my-jobs/my-jobs/edit",
      },
      draftJobs: {
        root: "/hire/my-jobs/draft-jobs",
        main: "/hire/my-jobs/draft-jobs",
      },
    },
    cvServices: {
      root: "/hire/cv-services",
      cvSearch: "/hire/cv-services/cv-search",
      mySavedSearches: "/hire/cv-services/my-saved-searches",
      cvFolders: "/hire/cv-services/cv-folders",
    },
    hrCommunity: {
      root: "/hire/hr-community",
      newsFeed: "/hire/hr-community/news-feed",
      myQuestions: "/hire/hr-community/my-questions",
      myAnswers: "/hire/hr-community/my-answers",
      myNetwork: "/hire/hr-community/my-network",
      findPeople: "/hire/hr-community/find-people",
      myRank: "/hire/hr-community/my-rank",
    },
    contactUs: {
      root: "/hire/contact-us",
      main: "/hire/contact-us/main",
    },
    account: {
      root: "/hire/account",
      main: "/hire/account",
      password: "/hire/account/password",
      personalProfile: "/hire/account/personal-profile",
      companyProfile: "/hire/account/company-profile",
      emailNotifications: "/hire/account/email-notifications",
      emailSpecialties: "/hire/account/email-specialties",
      controlShare: "/hire/account/control-share",
      userManagement: "/hire/account/user-management",
      cvTags: "/hire/account/cv-tags",
    },
  },
  work: {
    root: "/work",
    auth: {
      root: "/work/auth",
      signIn: "/work/auth/sign-in",
      facebookSignIn: "/work/auth/sign-in/facebook",
      googleSignIn: "/work/auth/sign-in/google",
      signUp: "/work/auth/sign-up",
      facebookSignUp: "/work/auth/sign-up/facebook",
      googleSignUp: "/work/auth/sign-up/google",
      forgotPassword: "/work/auth/forgot-password",
      resetPassword: "/work/auth/reset-password",
    },
    findJobs: {
      root: "/work/find-jobs",
      findJobs: "/work/find-jobs/work/find-jobs",
      recommendedJobs: "/work/find-jobs/recommended-jobs",
      savedJobs: "/work/find-jobs/saved-jobs",
      myJobAlerts: "/work/find-jobs/my-job-alerts",
      advancedSearch: "/work/find-jobs/advanced-search",
      browseJobs: "/work/find-jobs/browse-jobs",
      jobsByRole: {
        root: "/work/find-jobs/jobs-by-role",
        main: "/work/find-jobs/jobs-by-role",
      },
      jobsByLocation: {
        root: "/work/find-jobs/jobs-by-location",
        main: "/work/find-jobs/jobs-by-location",
      },
      jobsBySector: {
        root: "/work/find-jobs/jobs-by-sector",
        main: "/work/find-jobs/jobs-by-sector",
      },
      jobsByCompanies: {
        root: "/work/find-jobs/jobs-by-companies",
        main: "/work/find-jobs/jobs-by-companies",
      },
      executiveJobs: "/work/find-jobs/executive-jobs",
      salaries: "/work/find-jobs/salaries",
    },
    myCV: {
      root: "/work/my-cv",
      myCV: "/work/my-cv/work/my-cv",
      myOtherProfiles: "/work/my-cv/my-other-profiles",
      coverLetters: "/work/my-cv/cover-letters",
      blog: "/work/my-cv/blog",
    },
    myApplications: {
      root: "/work/my-applications",
      main: "/work/my-applications/main",
    },
    myVisibility: {
      root: "/work/my-visibility",
      myVisibility: "/work/my-visibility/work/my-visibility",
      whoViewedMy: "/work/my-visibility/who-viewed-my",
    },
    cvServices: {
      root: "/work/cv-services",
      professionalCV: "/work/cv-services/professional-cv",
      visualCVTemplates: "/work/cv-services/visual-cv-templates",
      coverLetterWriting: "/work/cv-services/cover-letter-writing",
      cvEvaluation: "/work/cv-services/cv-evaluation",
    },
    account: {
      root: "/work/account",
      main: "/work/account",
      minifiedProfile: {
        root: "/work/account/minified-profile",
      },
    },
  },
  account: {
    root: "/account",
    settings: "/account/settings",
    activityLog: "/account/activity-log",
  },
  profile: {
    root: "/profile",
    main: "/profile/main",
    myPosts: {
      root: "/profile/my-posts",
      detail: "/profile/my-posts/detail",
    },
  },
  contact: {
    root: "/contact",
    us: "/contact/us",
    consultants: "/contact/consultants",
  },
  about: {
    root: "/about",
    portal: "/about/portal",
    us: "/about/us",
  },
};

export default routes;
