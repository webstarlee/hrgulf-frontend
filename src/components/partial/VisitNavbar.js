import React, {Fragment, useState} from "react";
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
import INavbarProps from "./INavbarProps";

import routes from "core/routes";
import {changeLanguage} from "core/i18n";

const VisitNavbar = (props) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();

  const {goTo} = props;

  const {collapse, onNavigate} = props;

  const pathname = history.location.pathname;

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
                <MDBDropdownItem onClick={() => onNavigate(routes.contact.us)}>{t("NAVBAR.CONTACT.US")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.contact.consultants)}>{t("NAVBAR.CONTACT.CONSULTANTS")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
          <MDBNavItem active={pathname.startsWith(routes.about.root)}>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <span className="mr-2">{t("NAVBAR.ABOUT.ABOUT")}</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu className="text-left">
                <MDBDropdownItem onClick={() => onNavigate(routes.about.portal)}>{t("NAVBAR.ABOUT.PORTAL")}</MDBDropdownItem>
                <MDBDropdownItem onClick={() => onNavigate(routes.about.us)}>{t("NAVBAR.ABOUT.US")}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
        <MDBNavbarNav right>
          <MDBNavItem>
            <MDBBtn tag="a" size="sm" className="main-color white-text" onClick={e => onNavigate(routes.auth.signIn)}>{t("AUTH.SIGN_IN")}</MDBBtn>
          </MDBNavItem>
          <MDBNavItem>
            <MDBBtn tag="a" size="sm" outline onClick={e => onNavigate(routes.auth.signUp)}>{t("AUTH.SIGN_UP")}</MDBBtn>
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
};

VisitNavbar.propTypes = INavbarProps;

export default VisitNavbar;
