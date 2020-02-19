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
    workplace: {
      root: "/workplace",
      questionnaire: "/workplace/questionnaire",
      letters: "/workplace/letters",
      myCompanyProfiles: "/workplace/my-company-profiles",
      employerTest: "/workplace/employer-test",
    },
    myJobs: {
      root: "/my-jobs",
      postAJob: "/my-jobs/post-a-job",
      myJobs: "/my-jobs/my-jobs",
      draftJobs: "my-jobs/draft-jobs",
    },
    cvServices: {
      root: "/cv-services1",
      cvSearch: "/cv-services1/cv-search",
      mySavedSearches: "/cv-services1/my-saved-searches",
      cvFolders: "/cv-services1/cv-folders",
    },
    hrCommunity: {
      root: "/hr-community",
      newsFeed: "/hr-community/news-feed",
      myQuestions: "/hr-community/my-questions",
      myAnswers: "/hr-community/my-answers",
      myNetwork: "/hr-community/my-network",
      findPeople: "/hr-community/find-people",
      myRank: "/hr-community/my-rank",
    },
    contactUs: {
      root: "/contactUs1",
      main: "/contactUs1/main",
    },
  },
  work: {
    findJobs: {
      root: "/find-jobs",
      findJobs: "/find-jobs/find-jobs",
      recommendedJobs: "/find-jobs/recommended-jobs",
      savedJobs: "/find-jobs/saved-jobs",
      myJobAlerts: "/find-jobs/my-job-alerts",
      advancedSearch: "/find-jobs/advanced-search",
      browseJobs: "/find-jobs/browse-jobs",
      jobsByRole: "/find-jobs/jobs-by-role",
      jobsByLocation: "/find-jobs/jobs-by-location",
      jobsBySector: "/find-jobs/jobs-by-sector",
      jobsByCompanies: "/find-jobs/jobs-by-companies",
      executiveJobs: "/find-jobs/executive-jobs",
      salaries: "/find-jobs/salaries",
    },
    myCV: {
      root: "/my-cv",
      myCV: "/my-cv/my-cv",
      myOtherProfiles: "/my-cv/my-other-profiles",
      coverLetters: "/my-cv/cover-letters",
      blog: "/my-cv/blog",
    },
    myApplications: {
      root: "/my-applications",
      main: "/my-applications/main",
    },
    myVisibility: {
      root: "/my-visibility",
      myVisibility: "/my-visibility/my-visibility",
      whoViewedMy: "/my-visibility/who-viewed-my",
    },
    cvServices: {
      root: "/cv-services2",
      professionalCV: "/cv-services2/professional-cv",
      visualCVTemplates: "/cv-services2/visual-cv-templates",
      coverLetterWriting: "/cv-services2/cover-letter-writing",
      cvEvaluation: "/cv-services2/cv-evaluation",
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
