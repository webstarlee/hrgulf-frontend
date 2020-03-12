import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {Link, useHistory, useParams} from "react-router-dom";
import {
  MDBAlert,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBCol,
  MDBModal, MDBModalBody, MDBModalFooter,
  MDBModalHeader,
  MDBRow,
  ToastContainer
} from "mdbreact";
import {useTranslation} from "react-i18next";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {TransitionGroup, CSSTransition} from "react-transition-group";

import {ALERT, EFFECT, LAYOUT, RESULT, SCOPE} from "core/globals";
import routes from "core/routes";
import Loading from "components/Loading";
import ErrorNoData from "components/ErrorNoData";
import Pagination from "components/Pagination";
import toast, {Fade} from "components/MyToast";
import Service from "services/hire/workplace/LettersService";
import SearchBar from "./partial/SearchBar";
import ListView from "./partial/ListView";

import "./AllLettersPage.scss";

export default () => {
  const {page} = useParams();
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {user}} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [modal, setModal] = useState({});

  const [pageCount, setPageCount] = useState(0);
  const [items, setItems] = useState([]);

  const [type, setType] = useState(SCOPE.ALL);
  const [keyword, setKeyword] = useState("");

  const currentPage = page ? parseInt(page) : 1;
  const pageTitle = t("NAVBAR.HIRE.WORKPLACE.LETTERS");
  const addUrl = routes.hire.workplace.letters.add;

  const loadData = () => {
    setLoading(true);
    setAlert({});
    Service.list({page, pageSize: 9, userId: user.id, type: type === SCOPE.ALL ? undefined : type, keyword})
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

  const deleteItem = ({id}) => {
    toggleModal();
    setLoading(true);
    Service.delete({page, pageSize: 9, id: modal.deleteId, userId: user.id, type: type === SCOPE.ALL ? undefined : type, keyword})
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
  };

  const handlePageChange = page => {
    history.push(`${routes.hire.workplace.letters.all}/${page}`);
  };

  const handleDeleteItem = ({id, item}) => {
    setModal(Object.assign({}, modal, {show: true, title: t("COMMON.BUTTON.DELETE"), message: t("COMMON.QUESTION.DELETE", {item: item}), deleteId: id}));
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
  
  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBRow className="my-sm-2 my-md-4">
        <MDBCol md="5" className="order-1 order-md-0">
          <div className="full-width text-left mt-3">
            <Link to={addUrl}>
              <MDBBtn color="primary" size="sm" rounded disabled={!!loading}>
                {t("COMMON.BUTTON.NEW")}
              </MDBBtn>
            </Link>
          </div>
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
                  <ListView items={items} showNewLink={false} newLink={addUrl} detailLabel={t("COMMON.BUTTON.EDIT")} detailLink={addUrl} deleteLabel={t("COMMON.BUTTON.DELETE")} page={page} onDelete={handleDeleteItem} />
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
          <MDBBtn type="button" color="danger" size="sm" rounded onClick={deleteItem}>{t("COMMON.BUTTON.DELETE")}</MDBBtn>
          <MDBBtn type="button" color="secondary" size="sm" rounded onClick={toggleModal}>{t("COMMON.BUTTON.CANCEL")}</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </Fragment>
  );

  return payload();
};
