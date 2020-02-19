import React, {Fragment, useEffect, useState} from "react";
import {
  MDBBtn,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle, MDBIcon,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink
} from "mdbreact";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {GoogleLogout} from "react-google-login";

import routes from "core/routes";
import {changeLanguage} from "core/i18n";
import authActions from "actions/auth";
import {AUTH, RESULT, SOCIAL} from "core/globals";
import AuthService from "services/AuthService";
import AccountService from "services/AccountService";
import apis from "../../core/apis";

export default ({collapse, setCollapse}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState("");

  const pathname = history.location.pathname;

  useEffect(() => {
    AccountService.avatar({id: auth.user.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setAvatar(`${apis.assetsBaseUrl}${res.data.url}`);
        }
      })
      .catch(err => {

      })
  }, [auth]);

  const goTo = to => {
    setCollapse(false);
    history.push(to);
  };

  const handleSignOut = e => {
    AuthService.signOut();
    dispatch(authActions.signOut());
  };

  return (
    <Fragment>
      {/*<MDBCollapse isOpen={collapse} navbar className="text-left nav-inner">*/}
        <MDBNavbarNav left>
          <MDBNavItem active={pathname === routes.root}>
            <MDBNavLink to={routes.root}>{t("NAVBAR.HOME")}</MDBNavLink>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.work.findJobs.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.WORK.FIND_JOBS.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.findJobs)}>{t("NAVBAR.WORK.FIND_JOBS.FIND_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.recommendedJobs)}>{t("NAVBAR.WORK.FIND_JOBS.RECOMMENDED_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.savedJobs)}>{t("NAVBAR.WORK.FIND_JOBS.SAVED_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.myJobAlerts)}>{t("NAVBAR.WORK.FIND_JOBS.MY_JOB_ALERTS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.advancedSearch)}>{t("NAVBAR.WORK.FIND_JOBS.ADVANCED_SEARCH")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.browseJobs)}>{t("NAVBAR.WORK.FIND_JOBS.BROWSE_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.jobsByRole)}>{t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_ROLE")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.jobsByLocation)}>{t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_LOCATION")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.jobsBySector)}>{t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_SECTOR")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.jobsByCompanies)}>{t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_COMPANIES")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.executiveJobs)}>{t("NAVBAR.WORK.FIND_JOBS.EXECUTIVE_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.findJobs.salaries)}>{t("NAVBAR.WORK.FIND_JOBS.SALARIES")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.work.myCV.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.WORK.MY_CV.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.work.myCV.myCV)}>{t("NAVBAR.WORK.MY_CV.MY_CV")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.myCV.myOtherProfiles)}>{t("NAVBAR.WORK.MY_CV.MY_OTHER_PROFILES")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.myCV.coverLetters)}>{t("NAVBAR.WORK.MY_CV.COVER_LETTERS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.myCV.blog)}>{t("NAVBAR.WORK.MY_CV.BLOG")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.work.myApplications.root)}>
            <MDBNavLink to={routes.work.myApplications.main}>{t("NAVBAR.WORK.MY_APPLICATIONS.MAIN")}</MDBNavLink>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.work.myVisibility.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.WORK.MY_VISIBILITY.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.work.myVisibility.myVisibility)}>{t("NAVBAR.WORK.MY_VISIBILITY.MY_VISIBILITY")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.myVisibility.whoViewedMy)}>{t("NAVBAR.WORK.MY_VISIBILITY.WHO_VIEWED_MY")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.work.cvServices.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.WORK.CV_SERVICES.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.work.cvServices.professionalCV)}>{t("NAVBAR.WORK.CV_SERVICES.PROFESSIONAL_CV")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.cvServices.visualCVTemplates)}>{t("NAVBAR.WORK.CV_SERVICES.VISUAL_CV_TEMPLATES")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.cvServices.coverLetterWriting)}>{t("NAVBAR.WORK.CV_SERVICES.COVER_LETTER_WRITING")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.work.cvServices.cvEvaluation)}>{t("NAVBAR.WORK.CV_SERVICES.CV_EVALUATION")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
        {/*<MDBNavbarNav right>*/}
        {/*  <MDBNavItem>*/}
        {/*    <MDBDropdown>*/}
        {/*      <MDBDropdownToggle nav caret>*/}
        {/*        <span className="mr-2">{t("COMMON.LANGUAGE.LANGUAGE")}</span>*/}
        {/*      </MDBDropdownToggle>*/}
        {/*      <MDBDropdownMenu className="text-left">*/}
        {/*        <MDBDropdownItem onClick={() => changeLanguage("ar")}>{t("COMMON.LANGUAGE.ARABIC")}</MDBDropdownItem>*/}
        {/*        <MDBDropdownItem onClick={() => changeLanguage("en")}>{t("COMMON.LANGUAGE.ENGLISH")}</MDBDropdownItem>*/}
        {/*      </MDBDropdownMenu>*/}
        {/*    </MDBDropdown>*/}
        {/*  </MDBNavItem>*/}
        {/*  <MDBNavItem>*/}
        {/*    <MDBDropdown>*/}
        {/*      <MDBDropdownToggle className="dopdown-toggle" nav>*/}
        {/*        <img src={avatar} className="z-depth-1 white"*/}
        {/*             style={{ height: "35px", padding: 0 }} alt="" />*/}
        {/*      </MDBDropdownToggle>*/}
        {/*      <MDBDropdownMenu className="dropdown-default" right>*/}
        {/*        <MDBDropdownItem onClick={e => goTo(routes.account.settings)}>{t("NAVBAR.ACCOUNT.MY_ACCOUNT")}</MDBDropdownItem>*/}
        {/*        <MDBDropdownItem>*/}
        {/*          {auth.user.social === SOCIAL.NAME.GOOGLE && <GoogleLogout*/}
        {/*            clientId={AUTH.GOOGLE.CLIENT_ID}*/}
        {/*            onLogoutSuccess={handleSignOut}*/}
        {/*            onFailure={e => {}}*/}
        {/*            render={({disabled, onClick}) => (<div onClick={onClick}>{t("AUTH.SIGN_OUT")}</div>)}*/}
        {/*          >*/}
        {/*          </GoogleLogout>}*/}
        {/*          {!auth.user.social.length && <div onClick={handleSignOut}>{t("AUTH.SIGN_OUT")}</div>}*/}
        {/*        </MDBDropdownItem>*/}
        {/*      </MDBDropdownMenu>*/}
        {/*    </MDBDropdown>*/}
        {/*  </MDBNavItem>*/}
        {/*</MDBNavbarNav>*/}
      {/*</MDBCollapse>*/}
    </Fragment>
  )
}