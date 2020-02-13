import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {MDBNavbar, MDBNavbarBrand, MDBNavbarToggler} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import useWindowScrollPosition from "@rehooks/window-scroll-position";
import routes from "core/routes";
import images from "core/images";
import authActions from "actions/auth";
import {NAVBAR, PROJECT} from "core/globals";
import AuthService from "services/AuthService";
import VisitNavbar from "./partial/VisitNavbar";
import WorkNavbar from "./partial/WorkNavbar";

import "./Navbar.scss";

export default ({thresholdY}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();

  const [collapse, setCollapse] = useState(false);

  thresholdY = thresholdY || NAVBAR.SCROLLING_OFFSET;

  const options = {
    throttle: 100,
  };
  const position = useWindowScrollPosition(options);
  const flag = position.y > thresholdY;

  const pathname = history.location.pathname;

  const toggleCollapse = e => {
    setCollapse(!collapse);
  };
  
  const goTo = to => {
    setCollapse(false);
    history.push(to);
  };

  const handleLogo = e => {
    setCollapse(false);
    document.location.href = routes.mainGateway;
    return;
    if (PROJECT.IS_DEV) {
      history.push(routes.mainGateway);
    } else {
      document.location.href = routes.mainGateway;
    }
  };

  const handleMouseEnter = e => {

  };

  const handleMouseLeave = e => {

  };

  const handleSignOut = e => {
    AuthService.signOut();
    dispatch(authActions.signOut());
  };

  return (
    <MDBNavbar color={flag ? "mdb-color" : "white-md"} light={!flag} dark={flag} expand="md" scrolling fixed="top" id="nav-bar" scrollingNavbarOffset={NAVBAR.SCROLLING_OFFSET} className="z-depth-0 my-navbar">
      <MDBNavbarBrand href={routes.mainGateway} onClick={handleLogo}>
        <strong><img className="navbar-logo-icon" src={images.logo.logo100}/></strong>
      </MDBNavbarBrand>
      <MDBNavbarToggler onClick={toggleCollapse}/>

      {!auth.signedIn && <VisitNavbar collapse={collapse} setCollapse={setCollapse}/>}
      {!!auth.signedIn && <WorkNavbar collapse={collapse} setCollapse={setCollapse}/>}

      {/*<MDBCollapse isOpen={collapse} navbar className="text-left nav-inner">*/}
      {/*  <MDBNavbarNav left>*/}
      {/*    <MDBNavItem active={pathname === routes.root}>*/}
      {/*      <MDBNavLink to={routes.root}>{t("NAVBAR.HOME")}</MDBNavLink>*/}
      {/*      /!*<MDBNavLink to={routes.root}><img src={images.logo}/></MDBNavLink>*!/*/}
      {/*    </MDBNavItem>*/}
      {/*    <MDBNavItem active={pathname.startsWith(routes.contact.root)}>*/}
      {/*      <MDBDropdown onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>*/}
      {/*        <MDBDropdownToggle nav caret>*/}
      {/*          <span className="mr-2">{t("NAVBAR.CONTACT.CONTACT")}</span>*/}
      {/*        </MDBDropdownToggle>*/}
      {/*        <MDBDropdownMenu className="text-left">*/}
      {/*          <MDBDropdownItem onClick={() => goTo(routes.contact.us)}>{t("NAVBAR.CONTACT.US")}</MDBDropdownItem>*/}
      {/*          <MDBDropdownItem onClick={() => goTo(routes.contact.consultants)}>{t("NAVBAR.CONTACT.CONSULTANTS")}</MDBDropdownItem>*/}
      {/*        </MDBDropdownMenu>*/}
      {/*      </MDBDropdown>*/}
      {/*    </MDBNavItem>*/}
      {/*    <MDBNavItem active={pathname.startsWith(routes.about.root)}>*/}
      {/*      <MDBDropdown onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>*/}
      {/*        <MDBDropdownToggle nav caret>*/}
      {/*          <span className="mr-2">{t("NAVBAR.ABOUT.ABOUT")}</span>*/}
      {/*        </MDBDropdownToggle>*/}
      {/*        <MDBDropdownMenu className="text-left">*/}
      {/*          <MDBDropdownItem onClick={() => goTo(routes.about.portal)}>{t("NAVBAR.ABOUT.PORTAL")}</MDBDropdownItem>*/}
      {/*          <MDBDropdownItem onClick={() => goTo(routes.about.us)}>{t("NAVBAR.ABOUT.US")}</MDBDropdownItem>*/}
      {/*        </MDBDropdownMenu>*/}
      {/*      </MDBDropdown>*/}
      {/*    </MDBNavItem>*/}
      {/*  </MDBNavbarNav>*/}
      {/*  <MDBNavbarNav right>*/}
      {/*    <MDBNavItem>*/}
      {/*      <MDBDropdown>*/}
      {/*        <MDBDropdownToggle nav caret>*/}
      {/*          <span className="mr-2">{t("COMMON.LANGUAGE.LANGUAGE")}</span>*/}
      {/*        </MDBDropdownToggle>*/}
      {/*        <MDBDropdownMenu className="text-left">*/}
      {/*          <MDBDropdownItem onClick={() => changeLanguage("ar")}>{t("COMMON.LANGUAGE.ARABIC")}</MDBDropdownItem>*/}
      {/*          <MDBDropdownItem onClick={() => changeLanguage("en")}>{t("COMMON.LANGUAGE.ENGLISH")}</MDBDropdownItem>*/}
      {/*        </MDBDropdownMenu>*/}
      {/*      </MDBDropdown>*/}
      {/*    </MDBNavItem>*/}
      {/*    <MDBNavItem>*/}
      {/*      <MDBDropdown>*/}
      {/*        <MDBDropdownToggle nav caret>*/}
      {/*          <MDBIcon icon="user" className="d-inline-inline"/>*/}
      {/*        </MDBDropdownToggle>*/}
      {/*        <MDBDropdownMenu className="text-left">*/}
      {/*          {!auth.signedIn && <Fragment>*/}
      {/*            <MDBDropdownItem onClick={() => goTo(routes.auth.signIn)}>{t("AUTH.SIGN_IN")}</MDBDropdownItem>*/}
      {/*            <MDBDropdownItem onClick={() => goTo(routes.auth.signUp)}>{t("AUTH.SIGN_UP")}</MDBDropdownItem>*/}
      {/*          </Fragment>}*/}
      {/*          {auth.signedIn && <Fragment>*/}
      {/*            <MDBDropdownItem onClick={() => goTo(routes.profile.main)}>{t("AUTH.MY_ACCOUNT")}</MDBDropdownItem>*/}
      {/*            <MDBDropdownItem onClick={() => goTo(routes.profile.myPosts.root)}>{t("PROFILE.MY_POSTS.MY_POSTS")}</MDBDropdownItem>*/}
      {/*            <MDBDropdownItem onClick={handleSignOut}>{t("AUTH.SIGN_OUT")}</MDBDropdownItem>*/}
      {/*          </Fragment>}*/}
      {/*        </MDBDropdownMenu>*/}
      {/*      </MDBDropdown>*/}
      {/*    </MDBNavItem>*/}
      {/*  </MDBNavbarNav>*/}
      {/*</MDBCollapse>*/}

    </MDBNavbar>
  );
}
