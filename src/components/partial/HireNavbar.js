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
import apis from "core/apis";
import {ACCOUNT, NAVBAR, RESULT} from "core/globals";
import {changeLanguage} from "core/i18n";
import INavbarProps from "./INavbarProps";
import AccountService from "services/AccountService";

const HireNavbar = (props) => {
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
            <MDBNavLink to={routes.hire.root}>{t("NAVBAR.HOME")}</MDBNavLink>
            {/*<MDBNavLink to={routes.root}><img src={images.logo}/></MDBNavLink>*/}
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.workplace.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.workplace.questionnaire.all)}>{t("NAVBAR.HIRE.WORKPLACE.QUESTIONNAIRE")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.workplace.letters.all)}>{t("NAVBAR.HIRE.WORKPLACE.LETTERS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.workplace.myCompanyProfiles.main)}>{t("NAVBAR.HIRE.WORKPLACE.MY_COMPANY_PROFILES")}</MDBDropdownItem>
                {/*<MDBDropdownItem onClick={() => goTo(routes.hire.workplace.employerTest.main)}>{t("NAVBAR.HIRE.WORKPLACE.EMPLOYER_TEST")}</MDBDropdownItem>*/}
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.myJobs.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.HIRE.MY_JOBS.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.myJobs.postAJob)}>{t("NAVBAR.HIRE.MY_JOBS.POST_JOB")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.myJobs.myJobs)}>{t("NAVBAR.HIRE.MY_JOBS.MY_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.myJobs.draftJobs)}>{t("NAVBAR.HIRE.MY_JOBS.DRAFT_JOBS")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.cvServices.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.HIRE.MY_JOBS.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.cvServices.cvSearch)}>{t("NAVBAR.HIRE.CV_SERVICES.CV_SEARCH")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.cvServices.mySavedSearches)}>{t("NAVBAR.HIRE.CV_SERVICES.MY_SAVED_SEARCHES")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.cvServices.cvFolders)}>{t("NAVBAR.HIRE.CV_SERVICES.CV_FOLDERS")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.hrCommunity.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.HIRE.HR_COMMUNITY.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.hrCommunity.newsFeed)}>{t("NAVBAR.HIRE.HR_COMMUNITY.NEWS_FEED")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.hrCommunity.myQuestions)}>{t("NAVBAR.HIRE.HR_COMMUNITY.MY_QUESTIONS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.hrCommunity.myAnswers)}>{t("NAVBAR.HIRE.HR_COMMUNITY.MY_ANSWERS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.hrCommunity.myNetwork)}>{t("NAVBAR.HIRE.HR_COMMUNITY.MY_NETWORK")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.hrCommunity.findPeople)}>{t("NAVBAR.HIRE.HR_COMMUNITY.FIND_PEOPLE")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.hire.hrCommunity.myRank)}>{t("NAVBAR.HIRE.HR_COMMUNITY.MY_RANK")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.contactUs.root)}>
            <MDBNavLink to={routes.hire.contactUs.main}>{t("NAVBAR.HIRE.CONTACT_US.MAIN")}</MDBNavLink>
          </MDBNavItem>
        </MDBNavbarNav>
        <MDBNavbarNav right>
          {(!auth || !auth.signedIn) && <Fragment>
            {/*<MDBNavItem className="mr-2">*/}
            {/*  <MDBNavLink to={routes.hire.auth.signIn}>{t("COMMON.AUTH.SIGN_IN")}</MDBNavLink>*/}
            {/*</MDBNavItem>*/}
            <MDBNavItem>
              <MDBBtn tag="a" size="sm" className="main-color white-text" onClick={e => onNavigate(routes.hire.auth.signIn)}>{t("COMMON.AUTH.SIGN_IN")}</MDBBtn>
            </MDBNavItem>
            <MDBNavItem>
              <MDBBtn tag="a" size="sm" outline onClick={e => onNavigate(routes.hire.auth.signUp)}>{t("COMMON.AUTH.SIGN_UP")}</MDBBtn>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to={routes.work.root}>{t("COMMON.BUTTON.SWITCH_TO_WORK")}</MDBNavLink>
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
              <MDBDropdownMenu className="dropdown-default dropdown-menu-right" right>
                <MDBDropdownItem onClick={e => onNavigate(routes.account.settings)}>{t("NAVBAR.ACCOUNT.MY_ACCOUNT")}</MDBDropdownItem>
                <MDBDropdownItem onClick={e => onNavigate(routes.account.activityLog)}>{t("NAVBAR.ACCOUNT.ACTIVITY_LOG")}</MDBDropdownItem>
                <MDBDropdownItem onClick={e => onNavigate(routes.work.root)}>{t("COMMON.BUTTON.SWITCH_TO_WORK")}</MDBDropdownItem>
                <MDBDropdownItem>
                  <div onClick={onSignOut}>{t("COMMON.AUTH.SIGN_OUT")}</div>
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>}
        </MDBNavbarNav>
      </MDBCollapse>
    </Fragment>
  );
};

HireNavbar.propTypes = INavbarProps;

export default HireNavbar;
