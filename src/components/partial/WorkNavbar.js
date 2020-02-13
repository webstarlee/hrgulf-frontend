import React, {Fragment} from "react";
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
import AuthService from "services/AuthService";
import authActions from "actions/auth";
import {AUTH, SOCIAL} from "core/globals";

export default ({collapse, setCollapse}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();

  const pathname = history.location.pathname;

  const goTo = to => {
    setCollapse(false);
    history.push(to);
  };

  const handleSignOut = e => {
    AuthService.signOut();
    dispatch(authActions.signOut());
  };

  console.log(auth.user);

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
            {auth.user.social === SOCIAL.NAME.GOOGLE && <GoogleLogout
              clientId={AUTH.GOOGLE.CLIENT_ID}
              onLogoutSuccess={handleSignOut}
              onFailure={e => {}}
              render={({disabled, onClick}) => (
                <MDBBtn tag="a" size="sm" className="my-md-0 main-color white-text" onClick={handleSignOut}>{t("AUTH.SIGN_OUT")}</MDBBtn>
              )}
            >
            </GoogleLogout>}
            {!auth.user.social.length && <MDBBtn tag="a" size="sm" className="my-md-0 main-color white-text" onClick={handleSignOut}>{t("AUTH.SIGN_OUT")}</MDBBtn>}
          </MDBNavItem>
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
        </MDBNavbarNav>
      </MDBCollapse>
    </Fragment>
  )
}