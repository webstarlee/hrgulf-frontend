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
import {AUTH, NAVBAR, RESULT, SOCIAL} from "core/globals";
import authActions from "actions/auth";
import AuthService from "services/AuthService";
import AccountService from "services/AccountService";

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

  return (
    <Fragment>
      <MDBCollapse isOpen={collapse} navbar className="text-left nav-inner">
        <MDBNavbarNav left>
          <MDBNavItem active={pathname === routes.root}>
            <MDBNavLink to={routes.root}>{t("NAVBAR.HOME")}</MDBNavLink>
            {/*<MDBNavLink to={routes.root}><img src={images.logo}/></MDBNavLink>*/}
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.contact.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.CONTACT.CONTACT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.contact.us)}>{t("NAVBAR.CONTACT.US")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.contact.consultants)}>{t("NAVBAR.CONTACT.CONSULTANTS")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.about.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.ABOUT.ABOUT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => goTo(routes.about.portal)}>{t("NAVBAR.ABOUT.PORTAL")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => goTo(routes.about.us)}>{t("NAVBAR.ABOUT.US")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
        <MDBNavbarNav right>
          <MDBNavItem>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("COMMON.LANGUAGE.LANGUAGE")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => changeLanguage("ar")}>{t("COMMON.LANGUAGE.ARABIC")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => changeLanguage("en")}>{t("COMMON.LANGUAGE.ENGLISH")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem>
            <MDBDropdown>
              <MDBDropdownToggle className="dopdown-toggle" nav>
                <img src={avatar} className="z-depth-1 white my-navbar-avatar" style={{borderRadius: NAVBAR.AVATAR.HEIGHT / 100 * borderRadius}} />
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                <MDBDropdownItem onClick={e => goTo(routes.account.settings)}>{t("NAVBAR.ACCOUNT.MY_ACCOUNT")}</MDBDropdownItem>
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