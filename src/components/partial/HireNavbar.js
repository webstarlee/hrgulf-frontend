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
import apis from "core/apis";
import {ACCOUNT, AUTH, NAVBAR, RESULT, SOCIAL} from "core/globals";
import authActions from "actions/auth";
import AuthService from "services/AuthService";
import AccountService from "services/AccountService";

export default ({collapse, setCollapse, onChangeAccountTypeChange}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState("");
  const [borderRadius, setBorderRadius] = useState(0);

  const pathname = history.location.pathname;

  useEffect(() => {
    AccountService.avatar({id: auth.user.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setAvatar(`${apis.assetsBaseUrl}${res.data.url}`);
          setBorderRadius(res.data.borderRadius);
        }
      })
      .catch(err => {

      })
  }, [auth]);

  const goTo = to => {
    setCollapse(false);
    history.push(to);
  };

  const handleChangeAccountType = e => {
    onChangeAccountTypeChange(e);
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
            {/*<MDBNavLink to={routes.root}><img src={images.logo}/></MDBNavLink>*/}
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.workplace.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.hire.workplace.questionnaire.all)}>{t("NAVBAR.HIRE.WORKPLACE.QUESTIONNAIRE")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.workplace.letters.all)}>{t("NAVBAR.HIRE.WORKPLACE.LETTERS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.workplace.myCompanyProfiles.main)}>{t("NAVBAR.HIRE.WORKPLACE.MY_COMPANY_PROFILES")}</MDBDropdownItem>
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
                <MDBDropdownItem onClick={() => goTo(routes.hire.myJobs.postAJob)}>{t("NAVBAR.HIRE.MY_JOBS.POST_JOB")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.myJobs.myJobs)}>{t("NAVBAR.HIRE.MY_JOBS.MY_JOBS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.myJobs.draftJobs)}>{t("NAVBAR.HIRE.MY_JOBS.DRAFT_JOBS")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.cvServices.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.HIRE.MY_JOBS.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.hire.cvServices.cvSearch)}>{t("NAVBAR.HIRE.CV_SERVICES.CV_SEARCH")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.cvServices.mySavedSearches)}>{t("NAVBAR.HIRE.CV_SERVICES.MY_SAVED_SEARCHES")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.cvServices.cvFolders)}>{t("NAVBAR.HIRE.CV_SERVICES.CV_FOLDERS")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.hrCommunity.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.HIRE.HR_COMMUNITY.ROOT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.hire.hrCommunity.newsFeed)}>{t("NAVBAR.HIRE.HR_COMMUNITY.NEWS_FEED")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.hrCommunity.myQuestions)}>{t("NAVBAR.HIRE.HR_COMMUNITY.MY_QUESTIONS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.hrCommunity.myAnswers)}>{t("NAVBAR.HIRE.HR_COMMUNITY.MY_ANSWERS")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.hrCommunity.myNetwork)}>{t("NAVBAR.HIRE.HR_COMMUNITY.MY_NETWORK")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.hrCommunity.findPeople)}>{t("NAVBAR.HIRE.HR_COMMUNITY.FIND_PEOPLE")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.hire.hrCommunity.myRank)}>{t("NAVBAR.HIRE.HR_COMMUNITY.MY_RANK")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.hire.contactUs.root)}>
            <MDBNavLink to={routes.hire.contactUs.main}>{t("NAVBAR.HIRE.CONTACT_US.MAIN")}</MDBNavLink>
          </MDBNavItem>
        </MDBNavbarNav>
      {/*</MDBCollapse>*/}
    </Fragment>
  )
}