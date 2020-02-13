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
