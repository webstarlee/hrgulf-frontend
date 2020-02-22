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
import {ContentState, convertFromHTML, convertToRaw, EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

import {ALERT, EFFECT, RESULT} from "core/globals";
import routes from "core/routes";
import Loading from "components/Loading";
import toast, {Fade} from "components/MyToast";
import goToBack from "helpers/goToBack";
import Service from "services/hire/workplace/QuestionnairesService";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./NewQuestionnairePage.scss";

export default () => {
  const {params} = useParams();
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {user}} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [urlParams, setUrlParams] = useState({});

  const [itemId, setItemId] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());


  let pageTitle = t(`HIRE.WORKPLACE.QUESTIONNAIRE.ADD.${!!itemId ? "EDIT" : "ADD"}_QUESTIONNAIRE`);
  let backUrl = `${routes.hire.workplace.questionnaire.all}/${urlParams.page || 1}`;
  const addUrl = `${routes.hire.workplace.questionnaire.add}/${Base64.encode(JSON.stringify({
    page: urlParams.page,
  }))}`;

  let formikProps;

  let initialValues = {
    name: "",
    filterByScore: false,
    minScore: 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.NAME")})),
    minScore: Yup.string()
      .min(0, t("COMMON.VALIDATION.MIN", {field: t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.MIN_SCORE"),  value: 0}))
      .test("min-score", t("COMMON.VALIDATION.MIN", {field: t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.MIN_SCORE"), value: 0}), function (value) {
          return !this.parent.filterByScore || value >= 0;
      }),
  });

  const loadData = () => {
    setLoading(true);
    Service.get({id: urlParams.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          const data = res.data;
          setItemId(urlParams.id);
          const {name, description, filterByScore, minScore} = data;
          !!formikProps && formikProps.setValues({
            name,
            filterByScore,
            minScore,
          });
          setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(description))));
          // !!fileRef.current && fileRef.current
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
    const {name, filterByScore, minScore} = values;
    const description = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    const params = {id: itemId, userId: user.id, name, description, filterByScore: filterByScore || false, minScore};

    setSubmitting(true);
    Service.save(params)
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
      name: "",
      filterByScore: false,
      minScore: 0,
    });
    setEditorState(EditorState.createEmpty());
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
        <MDBBreadcrumbItem><Link to={backUrl}>{t("NAVBAR.HIRE.WORKPLACE.QUESTIONNAIRE")}</Link></MDBBreadcrumbItem>
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
                      <MDBInput id="name" name="name" label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.NAME")} background
                                containerClass="mb-0" value={values.name} onChange={handleChange} onBlur={handleBlur}>
                        {!!touched.name && !!errors.name && <div className="text-left invalid-field">{errors.name}</div>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12">
                      <div className="text-left">
                        <div className="grey-text">{t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.DESCRIPTION")}</div>
                        <Editor
                          id="editor"
                          editorState={editorState}
                          wrapperClassName="questionnaire-wrapper"
                          editorClassName="questionnaire-editor"
                          onEditorStateChange={setEditorState}

                        />
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput id="filterByScore" name="filterByScore" type="checkbox" label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.FILTER_BY_SCORE")} filled containerClass="text-left mt-4 mb-0" checked={values.filterByScore || false} onChange={handleChange} />
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput id="minScore" name="minScore" type="number" label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.MIN_SCORE")} background
                                containerClass="text-left mt-3 mb-0" disabled={!values.filterByScore} value={values.minScore} onChange={handleChange} onBlur={handleBlur}>
                        {!!errors.minScore && <div className="text-left invalid-field">{errors.minScore}</div>}
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
