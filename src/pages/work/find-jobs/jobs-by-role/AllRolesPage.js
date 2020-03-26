import React, {Fragment, useEffect, useState} from "react";
import {MDBAlert, MDBBreadcrumb, MDBBreadcrumbItem, MDBCol, MDBRow} from "mdbreact";
import {useTranslation} from "react-i18next";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {CSSTransition, TransitionGroup} from "react-transition-group";

import {EFFECT, LAYOUT, RESULT, SCOPE} from "core/globals";
import routes from "core/routes";
import Loading from "components/Loading";
import ErrorNoData from "components/ErrorNoData";
import toast from "components/MyToast";
import Service from "services/work/find-jobs/JobsByRoleService";
import ListView from "./partial/ListView";

import "./AllRolesPage.scss";

export default () => {
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [items, setItems] = useState([]);

  const [type, setType] = useState(SCOPE.ALL);
  const [keyword, setKeyword] = useState("");

  const pageTitle = t("NAVBAR.WORK.FIND_JOBS.JOBS_BY_ROLE");
  const addUrl = routes.hire.workplace.letters.add;

  const loadData = () => {
    setLoading(true);
    setAlert({});
    Service.listRoles({})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setItems(res.data);
        } else {
          setItems([]);
          toast.error(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        setItems([]);
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setLoading(false);
      });
  };

  useEffect(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
    loadData();
  }, []);
  
  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.WORK.FIND_JOBS.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBRow>
        {alert.show && <MDBCol md="12">
          <TransitionGroup>
            <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>
              <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
            </CSSTransition>
          </TransitionGroup>
        </MDBCol>}
        <MDBCol md="12">
          <TransitionGroup>
            <CSSTransition
              key={"CSSTransition"}
              timeout={{enter: EFFECT.TRANSITION_TIME, exit: 0}}
              classNames="fade-transition"
            >
              <div>
                {!!loading && <Loading style={{height: LAYOUT.LISTVIEW_HEIGHT}}/>}
                {!loading && !items.length && <ErrorNoData/>}
                {!loading && !!items.length && <Fragment>
                  <ListView items={items} detailLink={addUrl} />
                </Fragment>}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </MDBCol>
      </MDBRow>
    </Fragment>
  );

  return payload();
};
