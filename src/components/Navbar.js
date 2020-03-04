import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {MDBNavbar, MDBNavbarBrand, MDBNavbarToggler} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import useWindowScrollPosition from "@rehooks/window-scroll-position";

import routes from "core/routes";
import images from "core/images";
import {changeLanguage} from "core/i18n";
import {ACCOUNT, NAVBAR, PROJECT} from "core/globals";
import authActions from "actions/auth";
import AuthService from "services/AuthService";
import HireNavbar from "./partial/HireNavbar";
import WorkNavbar from "./partial/WorkNavbar";

import "./Navbar.scss";

export default ({type, thresholdY}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [collapse, setCollapse] = useState(false);
  const [dropdown, setDropdown] = useState({});

  thresholdY = thresholdY || NAVBAR.SCROLLING_OFFSET;

  const options = {
    throttle: 100,
  };
  const position = useWindowScrollPosition(options);
  const flag = position.y > thresholdY;

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

  const toggleCollapse = e => {
    setCollapse(!collapse);
  };

  const handleNavigate = to => {
    setCollapse(false);
    history.push(to);
  };

  const handleOpenDropdown = (item) => {
    setDropdown({
      ...dropdown,
      [item]: true,
    });
  };

  const handleCloseDropdown = (item) => {
    setDropdown({
      ...dropdown,
      [item]: false,
    });
  };

  const handleChangeAccountType = e => {

  };

  const onChangeLanguage = lang => {
    setCollapse(false);
    changeLanguage(lang);
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

      {type === ACCOUNT.TYPE.HIRE && <HireNavbar collapse={collapse} dropdown={dropdown} onChangeCollapse={setCollapse} onOpenDropdown={handleOpenDropdown} onCloseDropdown={handleCloseDropdown} onNavigate={handleNavigate} onChangeLanguage={onChangeLanguage} onSignOut={handleSignOut}/>}
      {type === ACCOUNT.TYPE.WORK && <WorkNavbar collapse={collapse} dropdown={dropdown} onChangeCollapse={setCollapse} onOpenDropdown={handleOpenDropdown} onCloseDropdown={handleCloseDropdown} onNavigate={handleNavigate} onChangeLanguage={onChangeLanguage} onSignOut={handleSignOut}/>}

    </MDBNavbar>
  );
}
