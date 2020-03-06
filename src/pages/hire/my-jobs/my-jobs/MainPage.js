import React, {Fragment, useEffect, useMemo, useState} from "react";
import {
  MDBAlert,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBCol,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBRow,
  ToastContainer
} from "mdbreact";
import {Link, useHistory, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {animateScroll as scroll} from "react-scroll";
import {useDispatch, useSelector} from "react-redux";

import {EFFECT, LAYOUT, MODAL, RESULT, SCOPE} from "core/globals";
import routes from "core/routes";
import myJobsAction from "actions/my-jobs";
import toast, {Fade} from "components/MyToast";
import Loading from "components/Loading";
import ErrorNoData from "components/ErrorNoData";
import Pagination from "components/Pagination";
import Service from "services/hire/my-jobs/MyJobsService";
import SearchBar from "./partial/SearchBar";
import ListView from "./partial/ListView";

import "./MainPage.scss";
import {Base64} from "js-base64";

export default (props) => {
  const {page} = useParams();
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {user}, myJobs} = useSelector(state => state);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [modal, setModal] = useState({});

  const [pageCount, setPageCount] = useState(0);
  const [items, setItems] = useState([]);

  const [type, setType] = useState(SCOPE.ALL);
  const [keyword, setKeyword] = useState("");
  const currentPage = page ? parseInt(page) : 1;

  const loadData = e => {
    setLoading(true);
    setAlert({});
    const params = {page, pageSize: 9, hireId: user.hireId, type: type === SCOPE.ALL ? undefined : type, keyword};
    Service.list(params)
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setPageCount(res.pageCount);
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

  const toggleModal = e => {
    setModal(Object.assign({}, modal, {show: !modal.show}));
  };

  const activateItem = ({id, isActive}) => {
    setLoading(true);
    Service.activate({page, pageSize: 9, id, isActive, hireId: user.hireId, type: type === SCOPE.ALL ? undefined : type, keyword})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setPageCount(res.pageCount);
          setItems(res.data);
          // toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setLoading(false);
      });
    toggleModal();
  };

  const deleteItem = ({id}) => {
    setLoading(true);
    Service.delete({page, pageSize: 9, id, hireId: user.hireId, type: type === SCOPE.ALL ? undefined : type, keyword})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setPageCount(res.pageCount);
          setItems(res.data);
          // toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setLoading(false);
      });
    toggleModal();
  };

  const handlePageChange = page => {
    history.push(`${routes.hire.workplace.letters.all}/${page}`);
  };

  const handleEditItem = (params) => {
    const detailLinkParam = Base64.encode(JSON.stringify({
      id: params.id,
      page,
    }));
    history.push(`${routes.hire.myJobs.myJobs.edit}/${detailLinkParam}`);
  };

  const handleActivateItem = ({id, item, isActive}) => {
    setModal(Object.assign({}, modal, {
      type: MODAL.TYPE.ACTIVATE,
      show: true,
      title: t("COMMON.BUTTON.DELETE"),
      message: isActive ? t("COMMON.QUESTION.ACTIVATE", {item: item}) : t("COMMON.QUESTION.DEACTIVATE", {item: item}),
      primaryButton: {
        color: isActive ? "success" : "warning",
        text: isActive ? t("COMMON.BUTTON.ACTIVATE") : t("COMMON.BUTTON.DEACTIVATE"),
      },
      item: {
        id,
        isActive,
      },
      onYes: activateItem,
    }));
  };

  const handleDeleteItem = ({id, item}) => {
    setModal(Object.assign({}, modal, {
      type: MODAL.TYPE.DELETE,
      show: true,
      title: t("COMMON.BUTTON.DELETE"),
      message: t("COMMON.QUESTION.DELETE", {item: item}),
      primaryButton: {
        color: "danger",
        text: t("COMMON.BUTTON.DELETE"),
      },
      item: {
        id,
      },
      onYes: deleteItem,
    }));
  };

  useEffect(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, []);

  useMemo(e => {
    loadData();
  }, [page, t, type, keyword]);

  useMemo(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, [page]);

  const pageTitle = t("NAVBAR.HIRE.MY_JOBS.MY_JOBS");

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.MY_JOBS.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBRow className="my-sm-2 my-md-4">
        <MDBCol md="5" className="order-1 order-md-0">
        </MDBCol>
        <MDBCol md="7" className="order-0 order-md-1">
          <SearchBar onChangeType={setType} onChangeKeyword={setKeyword}/>
        </MDBCol>
      </MDBRow>
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
              key={page}
              timeout={{enter: EFFECT.TRANSITION_TIME, exit: 0}}
              classNames="fade-transition"
            >
              <div>
                {!!loading && <Loading style={{height: LAYOUT.LISTVIEW_HEIGHT}}/>}
                {!loading && !items.length && <ErrorNoData/>}
                {!loading && !!items.length && <Fragment>
                  <div className="my-4 text-center">
                    <Pagination circle current={currentPage} pageCount={pageCount} onChange={handlePageChange}/>
                  </div>
                  <ListView items={items} showNewLink={false} detailLabel={t("COMMON.BUTTON.EDIT")} activateLabel={t("COMMON.BUTTON.ACTIVATE")} deactivateLabel={t("COMMON.BUTTON.DEACTIVATE")} deleteLabel={t("COMMON.BUTTON.DELETE")} page={page} onEdit={handleEditItem} onActivate={handleActivateItem} onDelete={handleDeleteItem} />
                  <div className="mt-4 text-center">
                    <Pagination circle current={currentPage} pageCount={pageCount} onChange={handlePageChange}/>
                  </div>
                </Fragment>}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </MDBCol>
      </MDBRow>
      <MDBModal isOpen={!!modal.show} toggle={toggleModal} centered backdropClassName="modal-backdrop">
        <MDBModalHeader toggle={toggleModal}>{modal.title}</MDBModalHeader>
        <MDBModalBody className="text-left">{modal.message}</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="button" color={modal.primaryButton && modal.primaryButton.color} size="sm" rounded onClick={e => {modal.onYes(modal.item); toggleModal();}}>{modal.primaryButton && modal.primaryButton.text}</MDBBtn>
          {/*<MDBBtn type="button" color="danger" size="sm" rounded onClick={modal.type === MODAL.TYPE.ACTIVATE ? activateItem : deleteItem}>{t("COMMON.BUTTON.DELETE")}</MDBBtn>*/}
          <MDBBtn type="button" color="secondary" size="sm" rounded onClick={toggleModal}>{t("COMMON.BUTTON.CANCEL")}</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
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
