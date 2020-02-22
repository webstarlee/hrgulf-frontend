import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {Link, useHistory, useParams} from "react-router-dom";
import {
  MDBAlert,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBCol, MDBIcon,
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
import toast, {Fade} from "components/MyToast";
import Service from "services/hire/workplace/QuestionnairesService";
import ListView from "./partial/ListView";

import "./QuestionsPage.scss";
import {Base64} from "js-base64";
import Questions from "./partial/Questions";

export default () => {
  const {params} = useParams();
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {user}} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [modal, setModal] = useState({});

  // const [id, setId] = useState();
  // const [page, setPage] = useState();
  // const [page2, setPage2] = useState();
  const [urlParams, setUrlParams] = useState({});

  const [pageCount, setPageCount] = useState(0);
  const [items, setItems] = useState([]);

  const currentPage = urlParams.page2 ? parseInt(urlParams.page2) : 1;
  const pageTitle = t("HIRE.WORKPLACE.QUESTIONNAIRE.QUESTIONS.QUESTIONS");

  const params1 = Base64.encode(JSON.stringify({
    questionnaireId: urlParams.id,
    page: urlParams.page,
    page2: urlParams.page2,
  }));
  const addUrl = `${routes.hire.workplace.questionnaire.addQuestion}/${params1}`;
  const backUrl = `${routes.hire.workplace.questionnaire.all}/${urlParams.page || 1}`;

  const loadData = () => {
    setLoading(true);
    setAlert({});
    Service.listQuestions({questionnaireId: urlParams.id, page: urlParams.page2})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setPageCount(res.pageCount);
          for (let row of res.data) {
            row["button"] = makeButtons(row)
          }
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

  const makeButtons = (data) => {
    const questionnaireId = urlParams.id;
    const {id, number} = data;
    const params = Base64.encode(JSON.stringify({
      id,
      questionnaireId,
      page: urlParams.page,
      page2: urlParams.page2,
    }));

    return (
      <Fragment>
        <Link to={`${routes.hire.workplace.questionnaire.addQuestion}/${params}`}><MDBBtn tag="a" size="sm" color="indigo" floating><MDBIcon icon="edit"/></MDBBtn></Link>
        <MDBBtn tag="a" size="sm" color="danger" floating className="ml-2" onClick={e => handleDeleteItem({id, item: "#" + number})}><MDBIcon icon="trash"/></MDBBtn>
      </Fragment>
    );
  };

  const toggleModal = e => {
    setModal(Object.assign({}, modal, {show: !modal.show}));
  };

  const deleteItem = ({id}) => {
    toggleModal();
    setLoading(true);
    Service.deleteQuestion({id: modal.deleteId, questionnaireId: urlParams.id})
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

  const handlePageChange = page2 => {
    const params = Base64.encode(JSON.stringify({
      id: urlParams.id,
      page: urlParams.page,
      page2,
    }));
    history.push(`${routes.hire.workplace.questionnaire.questions}/${params}`);
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
    if (!!params) {
      try {
        const raw = Base64.decode(params);
        const json = JSON.parse(raw);
        setUrlParams(json);
      } catch (e) {

      }
    }
  }, [params, t]);

  useMemo(e => {
    !!urlParams.id && loadData();
  }, [urlParams.id, urlParams.page2]);

  useMemo(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });
  }, [urlParams.page]);

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem><Link to={backUrl}>{t("NAVBAR.HIRE.WORKPLACE.QUESTIONNAIRE")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBRow className="my-sm-2 my-md-4">
        <MDBCol md="12" className="order-1 order-md-0">
          <div className="full-width text-left mt-3">
            <Link to={addUrl}>
              <MDBBtn color="primary" size="sm" rounded disabled={!!loading}>
                {t("COMMON.BUTTON.NEW")}
              </MDBBtn>
            </Link>
          </div>
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
          {/*{!loading && !items.length && <ErrorNoData/>}*/}
          {!loading && <Fragment>
            {!!items.length && <div className="my-4 text-center">
              <Pagination circle current={currentPage} pageCount={pageCount} onChange={handlePageChange}/>
            </div>}
            <Questions items={items}/>
            {!!items.length && <div className="mt-4 text-center">
              <Pagination circle current={currentPage} pageCount={pageCount} onChange={handlePageChange}/>
            </div>}
          </Fragment>}
        </MDBCol>
      </MDBRow>
      <MDBModal isOpen={!!modal.show} toggle={toggleModal} centered>
        <MDBModalHeader toggle={toggleModal}>{modal.title}</MDBModalHeader>
        <MDBModalBody className="text-left">{modal.message}</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="button" color="danger" size="sm" rounded onClick={deleteItem}>{t("COMMON.BUTTON.DELETE")}</MDBBtn>
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
