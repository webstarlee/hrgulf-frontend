import React, {Fragment, useEffect, useState} from "react";
import {
  MDBBtn,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink
} from "mdbreact";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import routes from "core/routes";
import {NAVBAR, RESULT} from "core/globals";
import apis from "core/apis";
import AccountService from "services/AccountService";
import INavbarProps from "./INavbarProps";

const WorkNavbar = (props) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth} = useSelector(state => state);

  const {onNavigate, onChangeAccountType, onChangeLanguage, onSignOut} = props;

  const [avatar, setAvatar] = useState("");
  const [borderRadius, setBorderRadius] = useState(0);

  const pathname = history.location.pathname;

  useEffect(() => {
    !!auth && !!auth.user && !!auth.user.id && AccountService.avatar({id: auth.user.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setAvatar(`${apis.assetsBaseUrl}${res.data.url}`);
          setBorderRadius(res.data.borderRadius);
        }
      })
      .catch(err => {

      })
  }, [auth]);

  return (
    <Fragment>
      <MDBCollapse isOpen={props.collapse} navbar className="text-left nav-inner">
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
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.findJobs)}>{t("NAVBAR.WORK.FIND_JOBS.FIND_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.recommendedJobs)}>{t("NAVBAR.WORK.FIND_JOBS.RECOMMENDED_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.savedJobs)}>{t("NAVBAR.WORK.FIND_JOBS.SAVED_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.myJobAlerts)}>{t("NAVBAR.WORK.FIND_JOBS.MY_JOB_ALERTS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.advancedSearch)}>{t("NAVBAR.WORK.FIND_JOBS.ADVANCED_SEARCH")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.browseJobs)}>{t("NAVBAR.WORK.FIND_JOBS.BROWSE_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.jobsByRole)}>{t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_ROLE")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.jobsByLocation)}>{t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_LOCATION")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.jobsBySector)}>{t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_SECTOR")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.jobsByCompanies)}>{t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_COMPANIES")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.executiveJobs)}>{t("NAVBAR.WORK.FIND_JOBS.EXECUTIVE_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.findJobs.salaries)}>{t("NAVBAR.WORK.FIND_JOBS.SALARIES")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.work.myCV.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.WORK.MY_CV.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => onNavigate(routes.work.myCV.myCV)}>{t("NAVBAR.WORK.MY_CV.MY_CV")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.myCV.myOtherProfiles)}>{t("NAVBAR.WORK.MY_CV.MY_OTHER_PROFILES")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.myCV.coverLetters)}>{t("NAVBAR.WORK.MY_CV.COVER_LETTERS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.myCV.blog)}>{t("NAVBAR.WORK.MY_CV.BLOG")}</MDBDropdownItem>
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
                <MDBDropdownItem onClick={() => onNavigate(routes.work.myVisibility.myVisibility)}>{t("NAVBAR.WORK.MY_VISIBILITY.MY_VISIBILITY")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.myVisibility.whoViewedMy)}>{t("NAVBAR.WORK.MY_VISIBILITY.WHO_VIEWED_MY")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.work.cvServices.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.WORK.CV_SERVICES.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => onNavigate(routes.work.cvServices.professionalCV)}>{t("NAVBAR.WORK.CV_SERVICES.PROFESSIONAL_CV")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.cvServices.visualCVTemplates)}>{t("NAVBAR.WORK.CV_SERVICES.VISUAL_CV_TEMPLATES")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.cvServices.coverLetterWriting)}>{t("NAVBAR.WORK.CV_SERVICES.COVER_LETTER_WRITING")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.work.cvServices.cvEvaluation)}>{t("NAVBAR.WORK.CV_SERVICES.CV_EVALUATION")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
        <MDBNavbarNav right>
          {(!auth || !auth.signedIn) && <Fragment>
            <MDBNavItem>
              <MDBBtn tag="a" size="sm" className="main-color white-text" onClick={e => onNavigate(routes.work.auth.signIn)}>{t("COMMON.AUTH.SIGN_IN")}</MDBBtn>
            </MDBNavItem>
            <MDBNavItem>
              <MDBBtn tag="a" size="sm" outline onClick={e => onNavigate(routes.work.auth.signUp)}>{t("COMMON.AUTH.SIGN_UP")}</MDBBtn>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to={routes.hire.root}>{t("COMMON.BUTTON.SWITCH_TO_HIRE")}</MDBNavLink>
            </MDBNavItem>
          </Fragment>}
          <MDBNavItem>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2 language-dropdown">{t("COMMON.LANGUAGE.LANGUAGE")}</span>
              </MDBDropdownToggle>
              {/*<MDBDropdownMenu className={`text-left`} right={!!auth || !auth.signedIn}>*/}
              <MDBDropdownMenu className={`text-left ${!!auth && auth.signedIn || "dropdown-menu-right"}`}>
                <MDBDropdownItem onClick={() => onChangeLanguage("ar")}>{t("COMMON.LANGUAGE.ARABIC")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onChangeLanguage("en")}>{t("COMMON.LANGUAGE.ENGLISH")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          {!!auth && auth.signedIn && <MDBNavItem>
            <MDBDropdown>
              <MDBDropdownToggle className="dopdown-toggle py-0" nav>
                <img src={avatar} className="z-depth-1 white my-navbar-avatar" style={{borderRadius: NAVBAR.AVATAR.HEIGHT / 100 * borderRadius}} />
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                <MDBDropdownItem onClick={e => onNavigate(routes.work.account.main)}>{t("NAVBAR.WORK.ACCOUNT.MY_ACCOUNT")}</MDBDropdownItem>
                <MDBDropdownItem onClick={e => onNavigate(routes.hire.root)}>{t("COMMON.BUTTON.SWITCH_TO_HIRE")}</MDBDropdownItem>
                <MDBDropdownItem onClick={onSignOut}>{t("COMMON.AUTH.SIGN_OUT")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>}
        </MDBNavbarNav>
      </MDBCollapse>
    </Fragment>
  )
};

WorkNavbar.propTypes = INavbarProps;

export default WorkNavbar;
