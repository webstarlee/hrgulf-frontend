import React, {Fragment, useEffect, useMemo, useRef, useState} from "react";
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
  MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions, ToastContainer
} from "mdbreact";
import MDBFileupload from "mdb-react-fileupload";
import {useTranslation} from "react-i18next";
import {animateScroll as scroll} from "react-scroll";
import {Helmet} from "react-helmet";
import {CSSTransition} from "react-transition-group";
import {Base64} from "js-base64";
import {Formik, useFormikContext} from "formik";
import {useSelector} from "react-redux";
import * as Yup from "yup";
import { EditorState, convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import {ALERT, AVATAR, COUNTRY_CODE, EFFECT, FILE_UPLOAD, LETTERS, RESULT} from "core/globals";
import routes from "core/routes";
import helpers from "core/helpers";
import Loading from "components/Loading";
import toast, {Fade} from "components/MyToast";
import goToBack from "helpers/goToBack";
import Service from "services/LettersService";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./NewLetterPage.scss";

export default () => {
  const {params} = useParams();
  const {t} = useTranslation();
  const history = useHistory();
  const {auth: {user}} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [itemId, setItemId] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [attachment, setAttachment] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [file, setFile] = useState();

  const fileRef = useRef(null);

  let pageTitle = t(`HIRE.WORKPLACE.LETTERS.ADD.${!!id ? "EDIT" : "ADD"}_LETTER`);

  let id, page;
  let formikProps;

  let initialValues = {
    type: LETTERS.TYPE.GENERIC,
    name: "",
    subject: "",
    // draft: "",
    // message: "",
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.LETTERS.FIELDS.TYPE")})),
    name: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.LETTERS.FIELDS.NAME")})),
    subject: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.LETTERS.FIELDS.SUBJECT")})),
    // message: Yup.string()
    //   .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.LETTERS.FIELDS.MESSAGE")})),
  });

  const loadData = () => {
    setLoading(true);
    Service.get({id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          const data = res.data;
          setItemId(id);
          // helpers.triggerChangeEvent("type", data.type);
          // helpers.triggerChangeEvent("name", data.name);
          // helpers.triggerChangeEvent("subject", data.subject);
          // setEditorState(convertToRaw(ContentState.createFromBlockArray(convertFromHTML(data.message))));
          setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(data.message))));
          setAttachment(data.attachment);
          !itemId && setItemId(res.data.insertId);
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
    const {type, name, subject} = values;

    const params = new FormData();
    !!itemId && params.append("id", itemId);
    params.append("userId", user.id);
    params.append("type", type);
    params.append("name", name);
    params.append("subject", subject);
    params.append("message", draftToHtml(convertToRaw(editorState.getCurrentContent())));
    !!file && params.append("file", file);

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
      type: LETTERS.TYPE.GENERIC,
      name: "",
      subject: "",
    });
    setFile(null);
    !!fileRef.current && fileRef.current.resetPreview();
    setTouched({});
    setErrors({});

    setAlert({});
    setItemId(undefined);

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

        id = json["id"];
        page = json["page"];
        !!id && loadData();
      } catch (e) {

      }
    }
  }, [params, t]);

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.WORKPLACE.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem><Link to={`${routes.hire.workplace.letters.all}/${page || 1}`}>{t("NAVBAR.HIRE.WORKPLACE.LETTERS")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <MDBRow>
        {alert.show && <MDBCol md="12">
          <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>
            <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
          </CSSTransition>
        </MDBCol>}
        <MDBCol md="12" className="order-1 order-md-0">
          {!!loading && <Loading/>}
          {!loading && <Fragment>
            <MDBCard>
              <MDBCardBody>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({values, touched, errors, setValues, setTouched, setErrors, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
                    <form className="mx-md-4 mx-sm-1 text-left" onSubmit={handleSubmit}>
                      <input hidden id="type" name="type" onChange={handleChange} onBlur={handleBlur}/>
                      <MDBRow>
                        <MDBCol md="6">
                          <MDBSelect label={t("HIRE.WORKPLACE.LETTERS.FIELDS.TYPE")} className="mt-3 mb-0"
                                     selected={values.type} getValue={val => {
                            helpers.triggerChangeEvent("type", val[0])
                          }}>
                            <MDBSelectInput/>
                            <MDBSelectOptions>
                              <MDBSelectOption value={LETTERS.TYPE.GENERIC} checked={values.type === LETTERS.TYPE.GENERIC}>{t("HIRE.WORKPLACE.LETTERS.TYPE.GENERIC")}</MDBSelectOption>
                              <MDBSelectOption value={LETTERS.TYPE.INTERVIEW} checked={values.type === COUNTRY_CODE.INTERVIEW}>{t("HIRE.WORKPLACE.LETTERS.TYPE.INTERVIEW")}</MDBSelectOption>
                              <MDBSelectOption value={LETTERS.TYPE.FOLLOWUP} checked={values.type === COUNTRY_CODE.FOLLOWUP}>{t("HIRE.WORKPLACE.LETTERS.TYPE.FOLLOWUP")}</MDBSelectOption>
                              <MDBSelectOption value={LETTERS.TYPE.ACCEPTANCE} checked={values.type === COUNTRY_CODE.ACCEPTANCE}>{t("HIRE.WORKPLACE.LETTERS.TYPE.ACCEPTANCE")}</MDBSelectOption>
                              <MDBSelectOption value={LETTERS.TYPE.REJECTION} checked={values.type === COUNTRY_CODE.REJECTION}>{t("HIRE.WORKPLACE.LETTERS.TYPE.REJECTION")}</MDBSelectOption>
                              <MDBSelectOption value={LETTERS.TYPE.ON_BOARDING} checked={values.type === COUNTRY_CODE.ON_BOARDING}>{t("HIRE.WORKPLACE.LETTERS.TYPE.ON_BOARDING")}</MDBSelectOption>
                            </MDBSelectOptions>
                          </MDBSelect>
                          {!!touched.type && !!errors.type && <div className="text-left invalid-field">{errors.type}</div>}
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol md="6">
                          <MDBInput id="name" name="name" label={t("HIRE.WORKPLACE.LETTERS.FIELDS.NAME")} background
                                    containerClass="mb-0" value={values.name} onChange={handleChange} onBlur={handleBlur}>
                            {!!touched.name && !!errors.name && <div className="text-left invalid-field">{errors.name}</div>}
                          </MDBInput>
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBInput id="subject" name="subject" label={t("HIRE.WORKPLACE.LETTERS.FIELDS.SUBJECT")} background
                                    containerClass="" value={values.subject} onChange={handleChange} onBlur={handleBlur}>
                            {!!touched.subject && !!errors.subject && <div className="text-left invalid-field">{errors.subject}</div>}
                          </MDBInput>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol md="12">
                          <div className="text-left">
                            <div className="grey-text">{t("HIRE.WORKPLACE.LETTERS.FIELDS.MESSAGE")}</div>
                            <Editor
                              id="editor"
                              editorState={editorState}
                              wrapperClassName="letter-wrapper"
                              editorClassName="letter-editor"
                              onEditorStateChange={setEditorState}

                            />
                            <textarea
                              disabled
                              value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                            />
                          </div>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol md="12" className="text-left mt-4">
                          <div className="grey-text">{t("HIRE.WORKPLACE.LETTERS.FIELDS.ATTACHMENT")} {!!attachmentName && `: ${attachmentName}`}</div>
                          <div className="letter-attachment-upload mx-auto">
                            {!loading && <MDBFileupload
                              ref={fileRef}
                              defaultFileSrc={attachment}
                              getValue={setFile}
                              showRemove={false}
                              maxFileSize={FILE_UPLOAD.MAXSIZE1}
                              maxFileSizePreview={FILE_UPLOAD.MAXSIZE1}
                              containerHeight={AVATAR.SIZE.HEIGHT + 50}
                              // allowedFileExtensions={extensions}
                              messageDefault={t("COMMON.FILE_UPLOAD.DEFAULT")}
                              messageReplace={t("COMMON.FILE_UPLOAD.REPLACE")}
                              messageRemove={t("COMMON.FILE_UPLOAD.REMOVE")}
                              messageError={t("COMMON.FILE_UPLOAD.ERROR")}
                              errorFileSize={t("COMMON.FILE_UPLOAD.ERROR_FILESIZE", {max: FILE_UPLOAD.MAXSIZE1})}
                              // errorFileExtension={t("COMMON.FILE_UPLOAD.ERROR_FILEEXTENSION", {extensions: extensions.join(", ")})}
                            />}
                          </div>
                        </MDBCol>
                      </MDBRow>
                      {/*<div className="fixed-bottom white px-md-3 py-md-3">*/}
                      <div className="mt-4 mb-3">
                        <MDBBtn type="submit" color="primary" size="sm" rounded disabled={!!loading || !!isSubmitting || (!!errors && !!Object.keys(errors).length)}>{t(`COMMON.BUTTON.${!!id ? "MODIFY" : "ADD"}`)}</MDBBtn>
                        <MDBBtn type="button" color="indigo" size="sm" rounded onClick={e => handleReset({setValues, setTouched, setErrors})}>{t(`COMMON.BUTTON.NEW`)}</MDBBtn>
                        <MDBBtn type="button" color="warning" size="sm" rounded onClick={goToBack}>{t(`COMMON.BUTTON.BACK`)}</MDBBtn>
                      </div>
                    </form>
                  )}
                </Formik>
              </MDBCardBody>
            </MDBCard>
          </Fragment>}
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