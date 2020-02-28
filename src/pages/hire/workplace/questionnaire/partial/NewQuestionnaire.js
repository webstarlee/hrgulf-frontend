import React, {Fragment, useMemo, useState} from "react";
import {useHistory} from "react-router-dom";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBInput, MDBRow, ToastContainer} from "mdbreact";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import {CSSTransition} from "react-transition-group";
import {useFormik} from "formik";
import {useSelector} from "react-redux";
import * as Yup from "yup";
import {ContentState, convertFromHTML, convertToRaw, EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import PropTypes from "prop-types";

import {ALERT, EFFECT, RESULT} from "core/globals";
import Loading from "components/Loading";
import toast, {Fade} from "components/MyToast";
import goToBack from "helpers/goToBack";
import Service from "services/hire/workplace/QuestionnairesService";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./NewQuestionnaire.scss";
import Questions from "./Questions";

const NewQuestionnaire = (props) => {
  const {id, addUrl, backUrl, showNewButton} = props;
  // const {params} = useParams();
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {user}} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [alert, setAlert] = useState({});

  const [itemId, setItemId] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [questions, setQuestions] = useState([]);

  let pageTitle = t(`HIRE.WORKPLACE.QUESTIONNAIRE.ADD.${!!itemId ? "EDIT" : "ADD"}_QUESTIONNAIRE`);

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
    Service.get({id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          const data = res.data;
          setItemId(id);
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

    setLoading2(true);
    Service.listQuestions({questionnaireId: id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setQuestions(res.data);
        } else {
          setQuestions([]);
        }
        setLoading2(false);
      })
      .catch(err => {
        setQuestions([]);
        setLoading2(false);
      });
  };

  const handleSubmit = (values, {setSubmitting}) => {
    const {name, filterByScore, minScore} = values;
    const description = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    const questionnaire = {id: itemId, userId: user.id, name, description, filterByScore: filterByScore || false, minScore};

    setSubmitting(true);
    Service.save({questionnaire, questions})
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

  useMemo(e => {
    !!id && loadData();
  }, [id]);

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
                  {/*<h4 className="h4-responsive"></h4>*/}
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
                    <MDBBtn type="submit" color="primary" size="sm" rounded disabled={!!loading || !!loading2 || !!isSubmitting || !questions.length}>{t(`COMMON.BUTTON.${!!itemId ? "EDIT" : "ADD"}`)}</MDBBtn>
                    {!!showNewButton && <MDBBtn type="button" color="indigo" size="sm" rounded onClick={e => handleReset({setValues, setTouched, setErrors})}>{t(`COMMON.BUTTON.NEW`)}</MDBBtn>}
                    <MDBBtn type="button" color="warning" size="sm" rounded onClick={goToBack}>{t(`COMMON.BUTTON.BACK`)}</MDBBtn>
                  </div>
                </form>
                <hr/>
                <Questions items={questions} onItemsChanged={setQuestions} onLoading={setLoading2}/>
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

NewQuestionnaire.propTypes = {
  id: PropTypes.any,
  addUrl: PropTypes.string,
  backUrl: PropTypes.string,
  showNewButton: PropTypes.bool,
};

export default NewQuestionnaire;
