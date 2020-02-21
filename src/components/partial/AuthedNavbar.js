import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ACCOUNT, NAVBAR, RESULT} from "core/globals";

import WorkNavbar from "./WorkNavbar";
import HireNavbar from "./HireNavbar";
import {
  MDBCollapse,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBNavbarNav,
  MDBNavItem
} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

import authActions from "actions/auth";
import apis from "core/apis";
import {changeLanguage} from "core/i18n";
import routes from "core/routes";

import AccountService from "services/AccountService";
import AuthService from "services/AuthService";

export default ({collapse, setCollapse}) => {
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

  const handleSignOut = e => {
    AuthService.signOut();
    dispatch(authActions.signOut());
  };

  const handleChangeAccountType = e => {

  };

  return (
    <Fragment>
      <MDBCollapse isOpen={collapse} navbar className="text-left nav-inner">
        {auth.user.accountType === ACCOUNT.TYPE.HIRE && <HireNavbar collapse={collapse} setCollapse={setCollapse} onChangeAccountTypeChange={handleChangeAccountType}/>}
        {auth.user.accountType === ACCOUNT.TYPE.WORK && <WorkNavbar collapse={collapse} setCollapse={setCollapse}/>}
        <MDBNavbarNav right>
          <MDBNavItem>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2 language-dropdown">{t("COMMON.LANGUAGE.LANGUAGE")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => changeLanguage("ar")}>{t("COMMON.LANGUAGE.ARABIC")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => changeLanguage("en")}>{t("COMMON.LANGUAGE.ENGLISH")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem>
            <MDBDropdown>
              <MDBDropdownToggle className="dopdown-toggle py-0" nav>
                <img src={avatar} className="z-depth-1 white my-navbar-avatar" style={{borderRadius: NAVBAR.AVATAR.HEIGHT / 100 * borderRadius}} />
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                <MDBDropdownItem onClick={e => goTo(routes.account.settings)}>{t("NAVBAR.ACCOUNT.MY_ACCOUNT")}</MDBDropdownItem>
                <MDBDropdownItem onClick={e => goTo(routes.account.activityLog)}>{t("NAVBAR.ACCOUNT.ACTIVITY_LOG")}</MDBDropdownItem>
                {auth.user.accountType === ACCOUNT.TYPE.WORK && <MDBDropdownItem onClick={handleChangeAccountType}>{t("NAVBAR.ACCOUNT.SWITCH_TO_HIRE")}</MDBDropdownItem>}
                {auth.user.accountType === ACCOUNT.TYPE.HIRE && <MDBDropdownItem onClick={handleChangeAccountType}>{t("NAVBAR.ACCOUNT.SWITCH_TO_WORK")}</MDBDropdownItem>}
                <MDBDropdownItem>
                  {/*{auth.user.social === SOCIAL.NAME.GOOGLE && <GoogleLogout*/}
                  {/*  clientId={AUTH.GOOGLE.CLIENT_ID}*/}
                  {/*  onLogoutSuccess={handleSignOut}*/}
                  {/*  onFailure={handleSignOut}*/}
                  {/*  render={({disabled, onClick}) => (<div onClick={onClick}>{t("AUTH.SIGN_OUT")}</div>)}*/}
                  {/*>*/}
                  {/*</GoogleLogout>}*/}
                  {/*{!auth.user.social.length && <div onClick={handleSignOut}>{t("AUTH.SIGN_OUT")}</div>}*/}
                  <div onClick={handleSignOut}>{t("AUTH.SIGN_OUT")}</div>
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
      </MDBCollapse>
    </Fragment>
  )
}