import React, {Fragment, useEffect} from "react";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBCard,
  MDBCardBody, MDBIcon,
  MDBNav,
  MDBNavItem,
  MDBNavLink, MDBTabContent, MDBTabPane,
  ToastContainer
} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useParams, useHistory} from "react-router-dom";
import {Helmet} from "react-helmet";

import {EFFECT} from "core/globals";
import routes from "core/routes";
import {Fade} from "components/MyToast";
import Service from "services/hire/workplace/EmployerTestServcice";

import "./MainPage.scss";

const TAB = {
  STEP1: "step1",
  STEP2: "step2",
  STEP3: "step3",
};

export default (props) => {
  const {t} = useTranslation();
  let {tab} = useParams();
  const history = useHistory();

  tab = tab || TAB.STEP1;


  useEffect(e => {
  }, [props]);

  const pageTitle = t("NAVBAR.HIRE.WORKPLACE.EMPLOYER_TEST");

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <div className="classic-tabs">
        <MDBNav classicTabs color="mdb-color">
          <MDBNavItem>
            <MDBNavLink to={`${routes.hire.workplace.employerTest.main}/${TAB.STEP1}`} link={routes.hire.workplace.employerTest.main} active={tab === TAB.STEP1} role="tab" className="text-transform-none" >
              {t("HIRE.WORKPLACE.EMPLOYER_TEST.STEP1")}
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink to={`${routes.hire.workplace.employerTest.main}/${TAB.STEP2}`} link={routes.hire.workplace.employerTest.main} active={tab === TAB.STEP2} role="tab" className="text-transform-none" >
               {t("HIRE.WORKPLACE.EMPLOYER_TEST.STEP2")}
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink to={`${routes.hire.workplace.employerTest.main}/${TAB.STEP3}`} link={routes.hire.workplace.employerTest.main} active={tab === TAB.STEP3} role="tab" className="text-transform-none" >
               {t("HIRE.WORKPLACE.EMPLOYER_TEST.STEP3")}
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
        <MDBTabContent
          className="card"
          activeItem={tab}
        >
          <MDBTabPane tabId={TAB.STEP1} role="tabpanel">
            {/*<PersonalInfo/>*/}
          </MDBTabPane>
          <MDBTabPane tabId={TAB.STEP2} role="tabpanel">
            {/*<ChangePassword/>*/}
          </MDBTabPane>
          <MDBTabPane tabId={TAB.STEP3} role="tabpanel">
            {/*<ChangePassword/>*/}
          </MDBTabPane>
        </MDBTabContent>
      </div>
      <ToastContainer
        className="text-left"
        position={t("DIRECTION") === "ltr" ? "top-right" : "top-left"}
        dir={t("DIRECTION")}
        hideProgressBar={true}
        // newestOnTop={true}
        // autoClose={0}
        autoClose={EFFECT.TRANSITION_TIME5}
        closeButton={false}
        transition={Fade}/>
    </Fragment>
  );

  return payload();
};
