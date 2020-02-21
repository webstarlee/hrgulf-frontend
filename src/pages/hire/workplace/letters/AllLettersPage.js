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
import {CSSTransition} from "react-transition-group";

import {ALERT, EFFECT, RESULT, SCOPE} from "core/globals";
import routes from "core/routes";
import Loading from "components/Loading";
import ErrorNoData from "components/ErrorNoData";
import Pagination from "components/Pagination";
import Service from "services/hire/LettersService";
import ListView from "./partial/ListView";

import "./AllLettersPage.scss";
import toast, {Fade} from "../../../../components/MyToast";
import SearchBar from "./partial/SearchBar";

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

  const loadData = () => {
    setLoading(true);
    setAlert({});
    Service.list({page, userId: user.id, type: type === SCOPE.ALL ? undefined : type, keyword})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setPageCount(res.pageCount);
          setItems(res.data);
        } else {
          toast.error(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        // setAlert({
        //   show: true,
        //   color: ALERT.DANGER,
        //   message: t('COMMON.ERROR.UNKNOWN_SERVER_ERROR'),
        // });
        toast.error(t('COMMON.ERROR.UNKNOWN_SERVER_ERROR'));
        setLoading(false);
      });
  };

  const toggleModal = e => {
    setModal(Object.assign({}, modal, {show: !modal.show}));
  };

  const deleteItem = ({id}) => {
    toggleModal();
    setLoading(true);
    Service.delete({id: modal.deleteId, userId: user.id})
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
    history.push(`${routes.hire.workplace.letters}/${page}`);
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
            <Link to={routes.hire.workplace.letters.add}>
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
          <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>
            <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
          </CSSTransition>
        </MDBCol>}
        <MDBCol md="12">
          {!!loading && <Loading/>}
          {!loading && !items.length && <ErrorNoData/>}
          {!loading && !!items.length && <Fragment>
            <div className="my-4 text-center">
              <Pagination circle current={currentPage} pageCount={pageCount} onChange={handlePageChange}/>
            </div>
            <ListView items={items} detailLabel={t("COMMON.BUTTON.EDIT")} detailLink={routes.hire.workplace.letters.add} deleteLabel={t("COMMON.BUTTON.DELETE")} page={page} onDelete={handleDeleteItem} />
            <div className="mt-4 text-center">
              <Pagination circle current={currentPage} pageCount={pageCount} onChange={handlePageChange}/>
            </div>
          </Fragment>}
        </MDBCol>
      </MDBRow>
      <MDBModal isOpen={!!modal.show} toggle={toggleModal} centered>
        <MDBModalHeader toggle={toggleModal}>{modal.title}</MDBModalHeader>
        <MDBModalBody className="text-left">{modal.message}</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="button" color="danger" onClick={deleteItem}>{t("COMMON.BUTTON.DELETE")}</MDBBtn>
          <MDBBtn type="button" color="secondary" onClick={toggleModal}>{t("COMMON.BUTTON.CANCEL")}</MDBBtn>
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
