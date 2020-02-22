import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {
  MDBAlert,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBInput,
  MDBRow,
  ToastContainer
} from "mdbreact";
import {useTranslation} from "react-i18next";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {CSSTransition} from "react-transition-group";
import {Base64} from "js-base64";
import {useFormik} from "formik";
import {useSelector} from "react-redux";
import * as Yup from "yup";

import {ALERT, EFFECT, RESULT} from "core/globals";
import routes from "core/routes";
import Loading from "components/Loading";
import toast, {Fade} from "components/MyToast";
import goToBack from "helpers/goToBack";
import Service from "services/hire/workplace/QuestionnairesService";

import "./NewQuestionPage.scss";

export default () => {
  const {params} = useParams();
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {user}} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  // const [id, setId] = useState();
  // const [questionnaireId, setQuestionnaireId] = useState();
  // const [page, setPage] = useState();
  // const [page2, setPage2] = useState();
  const [urlParams, setUrlParams] = useState({});

  const [itemId, setItemId] = useState();


  let pageTitle = t(`HIRE.WORKPLACE.QUESTIONNAIRE.QUESTIONS.ADD.${!!itemId ? "EDIT" : "ADD"}_QUESTION`);
  let questionnaireUrl = `${routes.hire.workplace.questionnaire.all}/${urlParams.page || 1}`;
  let questionsUrl = `${routes.hire.workplace.questionnaire.questions}/${Base64.encode(JSON.stringify({
    ...urlParams,
    id: urlParams.questionnaireId,
  }))}`;
  const addUrl = `${routes.hire.workplace.questionnaire.addQuestion}/${Base64.encode(JSON.stringify({
    questionnaireId: urlParams.questionnaireId,
    page: urlParams.page,
    page2: urlParams.page2,
  }))}`;

  let formikProps;

  let initialValues = {
    question: "",
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.QUESTIONNAIRE.QUESTIONS.FIELDS.QUESTION")})),
  });

  const loadData = () => {
    setLoading(true);
    Service.getQuestion({id: urlParams.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          const data = res.data;
          setItemId(urlParams.id);
          const {question} = data;
          !!formikProps && formikProps.setValues({
            question,
          });

          setAlert({});
        } else {
          setAlert({
            show: true,
            color: ALERT.DANGER,
            message: res.message,
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setAlert({
          show: true,
          color: ALERT.DANGER,
          message: t('COMMON.ERROR.UNKNOWN_SERVER_ERROR'),
        });
        setLoading(false);
      });
  };

  const handleSubmit = (values, {setSubmitting}) => {
    const {question} = values;

    const params = {id: itemId, questionnaireId: urlParams.questionnaireId, question};

    setSubmitting(true);
    Service.saveQuestion(params)
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          !itemId && setItemId(res.data.insertId);
        } else {
          toast.error(res.message);
        }
        setSubmitting(false);
      })
      .catch(err => {
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setSubmitting(false);
      });
  };

  const handleReset = ({setValues, setTouched, setErrors}) => {
    setValues({
      question: "",
    });
    setTouched({});
    setErrors({});

    setAlert({});
    setItemId(undefined);

    history.location.pathname !== addUrl && history.push(addUrl);
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
  }, [urlParams.id]);

  formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {values, touched, errors, setValues, setTouched, setErrors, handleChange, handleBlur, isSubmitting} = formikProps;

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem><Link to={questionnaireUrl}>{t("NAVBAR.HIRE.WORKPLACE.QUESTIONNAIRE")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem><Link to={questionsUrl}>{t("HIRE.WORKPLACE.QUESTIONNAIRE.QUESTIONS.QUESTIONS")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBRow>
        {alert.show && <MDBCol md="12">
          <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>
            <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
          </CSSTransition>
        </MDBCol>}
        <MDBCol md="12">
          <MDBCard>
            <MDBCardBody>
              {!!loading && <Loading/>}
              {!loading && <Fragment>
                <form className="mx-md-4 mx-sm-1 text-left" onSubmit={formikProps.handleSubmit}>
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBInput id="question" name="question" label={t("HIRE.WORKPLACE.QUESTIONNAIRE.QUESTIONS.FIELDS.QUESTION")} background
                                containerClass="mb-0" value={values.question} onChange={handleChange} onBlur={handleBlur}>
                        {!!touched.question && !!errors.question && <div className="text-left invalid-field">{errors.question}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <div className="mt-4 mb-3">
                    <MDBBtn type="submit" color="primary" size="sm" rounded disabled={!!loading || !!isSubmitting || (!!errors && !!Object.keys(errors).length)}>{t(`COMMON.BUTTON.${!!itemId ? "EDIT" : "ADD"}`)}</MDBBtn>
                    <MDBBtn type="button" color="indigo" size="sm" rounded onClick={e => handleReset({setValues, setTouched, setErrors})}>{t(`COMMON.BUTTON.NEW`)}</MDBBtn>
                    <MDBBtn type="button" color="warning" size="sm" rounded onClick={goToBack}>{t(`COMMON.BUTTON.BACK`)}</MDBBtn>
                  </div>
                </form>
              </Fragment>}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
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
