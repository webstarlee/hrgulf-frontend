import React, {Fragment, useEffect, useState} from "react";
import {useSelector} from "react-redux";
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
import apis from "core/apis";
import {changeLanguage} from "core/i18n";
import routes from "core/routes";
import INavbarProps from "./INavbarProps";

import AccountService from "services/AccountService";

const AuthedNavbar = (props) => {
  const {t} = useTranslation();
  const {auth} = useSelector(state => state);

  const {onNavigate, onChangeAccountType, onSignOut} = props;

  const [avatar, setAvatar] = useState("");
  const [borderRadius, setBorderRadius] = useState(0);

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

  return (
    <Fragment>
      <MDBCollapse isOpen={props.collapse} navbar className="text-left nav-inner">
        {auth.user.accountType === ACCOUNT.TYPE.HIRE && <HireNavbar {...props}/>}
        {auth.user.accountType === ACCOUNT.TYPE.WORK && <WorkNavbar {...props} />}
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
                <MDBDropdownItem onClick={e => onNavigate(routes.account.settings)}>{t("NAVBAR.ACCOUNT.MY_ACCOUNT")}</MDBDropdownItem>
                <MDBDropdownItem onClick={e => onNavigate(routes.account.activityLog)}>{t("NAVBAR.ACCOUNT.ACTIVITY_LOG")}</MDBDropdownItem>
                {auth.user.accountType === ACCOUNT.TYPE.WORK && <MDBDropdownItem onClick={onChangeAccountType}>{t("NAVBAR.ACCOUNT.SWITCH_TO_HIRE")}</MDBDropdownItem>}
                {auth.user.accountType === ACCOUNT.TYPE.HIRE && <MDBDropdownItem onClick={onChangeAccountType}>{t("NAVBAR.ACCOUNT.SWITCH_TO_WORK")}</MDBDropdownItem>}
                <MDBDropdownItem>
                  {/*{auth.user.social === SOCIAL.NAME.GOOGLE && <GoogleLogout*/}
                  {/*  clientId={AUTH.GOOGLE.CLIENT_ID}*/}
                  {/*  onLogoutSuccess={handleSignOut}*/}
                  {/*  onFailure={handleSignOut}*/}
                  {/*  render={({disabled, onClick}) => (<div onClick={onClick}>{t("AUTH.SIGN_OUT")}</div>)}*/}
                  {/*>*/}
                  {/*</GoogleLogout>}*/}
                  {/*{!auth.user.social.length && <div onClick={handleSignOut}>{t("AUTH.SIGN_OUT")}</div>}*/}
                  <div onClick={onSignOut}>{t("AUTH.SIGN_OUT")}</div>
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
      </MDBCollapse>
    </Fragment>
  )
};

AuthedNavbar.propTypes = INavbarProps;

export default AuthedNavbar;
