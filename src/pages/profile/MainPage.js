import React, {Fragment, useEffect} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem, MDBCol,
  MDBIcon,
  MDBNav,
  MDBNavItem,
  MDBNavLink, MDBRow,
  MDBTabContent,
  MDBTabPane
} from "mdbreact";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";

import routes from "core/routes";
import Avatar from "./partial/Avatar";
import PersonalInfo from "./partial/PersonalInfo";
// import MyPosts from "./partial/MyPosts";
import ChangePassword from "./partial/ChangePassword";

import "./MainPage.scss";

export default (props) => {
  const {t} = useTranslation();
  let {tab} = useParams();
  const history = useHistory();

  const TAB_PERSONAL_INFO = "personal-info";
  const TAB_SOCIAL_MEDIA = "social-media";
  const TAB_PASSWORD = "password";

  tab = tab || TAB_PERSONAL_INFO;
  let CURRENT_TAB;
  switch (tab) {
    case TAB_PERSONAL_INFO:
      CURRENT_TAB = t("PROFILE.MAIN.PERSONAL_INFO");
      break;
    case TAB_SOCIAL_MEDIA:
      CURRENT_TAB = t("PROFILE.MAIN.SOCIAL_MEDIA");
      break;
    case TAB_PASSWORD:
      CURRENT_TAB = t("PROFILE.MAIN.PASSWORD");
      break;
  }

  useEffect(e => {
  }, [props]);

  const handleChangeTab = tab => {
    const pathname = `${routes.profile.main}/${tab}`;
    history.push(pathname);
  };

  return (
    <Fragment>
      <Helmet>
        <title>{t("PROFILE.PROFILE")} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem><Link to={routes.profile.main}>{t("PROFILE.PROFILE")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{CURRENT_TAB}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBRow>
        <MDBCol md={3}>
          <Avatar/>
        </MDBCol>
        <MDBCol md={9}>
          <div className="classic-tabs">
            <MDBNav classicTabs color="mdb-color">
              <MDBNavItem>
                <MDBNavLink to={`${routes.profile.main}/${TAB_PERSONAL_INFO}`} link={routes.profile.main} active={tab === TAB_PERSONAL_INFO} role="tab" onClick={e => handleChangeTab(TAB_PERSONAL_INFO)} >
                  <MDBIcon icon="user" /> {t("PROFILE.MAIN.PERSONAL_INFO")}
                </MDBNavLink>
              </MDBNavItem>
              {/*<MDBNavItem>*/}
              {/*  <MDBNavLink to={`${routes.profile.main}/${TAB_SOCIAL_MEDIA}`} link={routes.profile.main} active={tab === TAB_SOCIAL_MEDIA} role="tab" onClick={e => handleChangeTab(TAB_SOCIAL_MEDIA)} >*/}
              {/*    <MDBIcon icon="users" /> {t("PROFILE.MAIN.SOCIAL_MEDIA")}*/}
              {/*  </MDBNavLink>*/}
              {/*</MDBNavItem>*/}
              <MDBNavItem>
                <MDBNavLink to={`${routes.profile.main}/${TAB_PASSWORD}`} link={routes.profile.main} active={tab === TAB_PASSWORD} role="tab" onClick={e => handleChangeTab(TAB_PASSWORD)} >
                  <MDBIcon icon="key" /> {t("PROFILE.MAIN.PASSWORD")}
                </MDBNavLink>
              </MDBNavItem>
            </MDBNav>
            <MDBTabContent
              className="card"
              activeItem={tab}
            >
              <MDBTabPane tabId={TAB_PERSONAL_INFO} role="tabpanel">
                <PersonalInfo/>
              </MDBTabPane>
              {/*<MDBTabPane tabId={TAB_SOCIAL_MEDIA} role="tabpanel">*/}
              {/*  <p className="mt-2">*/}
              {/*    Etsy mixtape wayfarers, ethical wes anderson tofu before*/}
              {/*    they sold out mcsweeney"s organic lomo retro fanny pack*/}
              {/*    lo-fi farm-to-table readymade. Messenger bag gentrify*/}
              {/*    pitchfork tattooed craft beer, iphone skateboard locavore*/}
              {/*    carles etsy salvia banksy hoodie helvetica. DIY synth PBR*/}
              {/*    banksy irony. Leggings gentrify squid 8-bit cred pitchfork.*/}
              {/*    Williamsburg banh mi whatever gluten-free, carles pitchfork*/}
              {/*    biodiesel fixie etsy retro mlkshk vice blog. Scenester cred*/}
              {/*    you probably haven"t heard of them, vinyl craft beer blog*/}
              {/*    stumptown. Pitchfork sustainable tofu synth chambray yr.*/}
              {/*  </p>*/}
              {/*</MDBTabPane>*/}
              <MDBTabPane tabId={TAB_PASSWORD} role="tabpanel">
                <ChangePassword/>
              </MDBTabPane>
            </MDBTabContent>
          </div>
        </MDBCol>
      </MDBRow>
    </Fragment>
  );
}