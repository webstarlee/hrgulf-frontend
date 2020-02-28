import React, {Fragment, useEffect, useMemo, useState} from "react";
import {
  MDBBtn,
  MDBCol, MDBIcon, MDBInput,
  MDBModal,
  MDBModalBody, MDBModalFooter,
  MDBModalHeader,
  MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions,
  MDBTable,
  MDBTableBody,
  MDBTableHead
} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import * as Yup from "yup";
import PropTypes, {func} from "prop-types";

import {DELAY, EFFECT, QUESTIONNAIRE, RESULT} from "core/globals";
import helpers from "core/helpers";
import goToBack from "helpers/goToBack";
import useDebounce from "helpers/useDebounce";
import Service from "services/hire/workplace/QuestionnairesService";

const Questions = (props) => {
  const {items, onItemsChanged, onLoading} = props;
  const {t} = useTranslation();

  const [alert, setAlert] = useState({});
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal2, setModal2] = useState({});

  const [answers, setAnswers] = useState("");
  const [answerItems, setAnswerItems] = useState([]);

  let formikProps;

  const initialValues = {
    index: -1,
    question: "",
    type: QUESTIONNAIRE.QUESTION.TYPE.YES_NO,
    answers: "",
    required: false,
    hasCorrectAnswer: false,
    correctAnswer: "",
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string()
      .required(t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.QUESTION")})),
    answers: Yup.string()
      .test("answers-test", t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.ANSWERS")}), function (value) {
        const type = this.parent.type;
        value = !!value ? value.trim() : "";

        return type !== QUESTIONNAIRE.QUESTION.TYPE.SELECT || !!value.length;
      }),
    correctAnswer: Yup.string()
      .test("correctAnswer-test", t("COMMON.VALIDATION.REQUIRED", {field: t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.CORRECT_ANSWER")}), function (value) {
        const hasCorrectAnswer = this.parent.hasCorrectAnswer;
        value = !!value ? value.trim() : "";

        return !hasCorrectAnswer || !!value.length;
      }),
  });

  const deleteItem = index => {
    items.splice(modal2.deleteId, 1);
    onItemsChanged(items);
    setModal2Open(false);
  };

  const handleNew = e => {
    formikProps.setValues(initialValues);
    formikProps.setTouched({});
    formikProps.setErrors({});
    setModal1Open(true);
  };

  const handleDelete = (item, index) => {
    setModal2(Object.assign({}, modal2, {show: true, title: t("COMMON.BUTTON.DELETE"), message: t("COMMON.QUESTION.DELETE", {item: item.question}), deleteId: index}));
    setModal2Open(true);
  };

  const handleSubmit = (values, {setSubmitting}) => {
    const {index, question, type, answers, required, hasCorrectAnswer, correctAnswer} = values;
    setSubmitting(true);
    let newItems;
    const newItem = {
      number: index === -1 ? items.length + 1 : index,
      question,
      type,
      answers: answers || "",
      required,
      hasCorrectAnswer,
      correctAnswer: correctAnswer || "",
    };
    if (index === -1) {
      newItems = items.concat([newItem]);
      formikProps.setFieldValue("index", items.length);
      onItemsChanged(newItems);
    } else {
      items.splice(index, 1, newItem);
      onItemsChanged(items);
    }
    setModal1Open(false);
    setSubmitting(false);
  };

  formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {values, touched, errors, setValues, setTouched, setErrors, handleChange, handleBlur, isSubmitting} = formikProps;

  const debouncedAnswers = useDebounce(values.answers, DELAY.DELAY2);
  useMemo(e => {
    console.log(debouncedAnswers);
    const arr = debouncedAnswers.split(",");
    const answerItems = arr.filter(answer => !!answer.trim().length);
    setAnswerItems(answerItems);
  }, [debouncedAnswers]);


  const payload = () => (
    <div className="text-left mt-4">
      <MDBRow>
        <MDBCol md="7" className="text-left">
          <h4 className="h4-responsive">{t("HIRE.WORKPLACE.QUESTIONNAIRE.QUESTIONS.QUESTIONS")}</h4>
        </MDBCol>
        <MDBCol md="5" className="text-right">
          <MDBBtn type="button" color="primary" size="sm" rounded onClick={handleNew}>{t(`COMMON.BUTTON.ADD`)}</MDBBtn>
          <MDBBtn type="button" color="warning" size="sm" rounded onClick={goToBack}>{t(`COMMON.BUTTON.BACK`)}</MDBBtn>
        </MDBCol>
      </MDBRow>
      <MDBTable responsive striped>
        <MDBTableHead>
          <tr className="">
            <th className="nomer-col">#</th>
            <th>{t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.QUESTION")}</th>
            <th>{t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.TYPE")}</th>
            {/*<th>{t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.ANSWERS")}</th>*/}
            {/*<th>{t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.REQUIRED2")}</th>*/}
            <th>{t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.CORRECT_ANSWER")}</th>
            <th className="p-2 edit-col-2"/>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {!!items.length && items.map((item, index) => (
            <tr key={index} className="">
              <td>{index + 1}</td>
              <td>{item.question}</td>
              <td>
                {item.type === QUESTIONNAIRE.QUESTION.TYPE.YES_NO && t("COMMON.QUESTIONNAIRE.QUESTION_TYPE.YES_NO")}
                {item.type === QUESTIONNAIRE.QUESTION.TYPE.SELECT && t("COMMON.QUESTIONNAIRE.QUESTION_TYPE.SELECT")}
                {item.type === QUESTIONNAIRE.QUESTION.TYPE.TEXT && t("COMMON.QUESTIONNAIRE.QUESTION_TYPE.TEXT")}
              </td>
              {/*<td>{item.type === QUESTIONNAIRE.QUESTION.TYPE.SELECT && item.answers}</td>*/}
              {/*<td>{t(`COMMON.BUTTON.${item.required ? "YES" : "NO"}`)}</td>*/}
              <td>{item.hasCorrectAnswer ? item.correctAnswer : ""}</td>
              <td className="edit-col">
                <MDBBtn tag="a" floating color="secondary" size="sm">
                  <MDBIcon icon="edit"/>
                </MDBBtn>
                <MDBBtn tag="a" floating color="danger" size="sm" className="ml-2" onClick={e => handleDelete(item, index)}>
                  <MDBIcon icon="trash"/>
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      <MDBModal isOpen={modal1Open} toggle={e => {}} centered size="lg">
        <MDBModalHeader
          toggle={e => setModal1Open(!modal1Open)}>{t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.QUESTION")}</MDBModalHeader>
        <MDBModalBody>
          <form onSubmit={formikProps.handleSubmit}>
            <input hidden id="type" name="type" onChange={handleChange} onBlur={handleBlur}/>
            <input hidden id="correctAnswer" name="correctAnswer" onChange={handleChange} onBlur={handleBlur}/>
            <MDBRow>
              <MDBCol md="12">
                <MDBInput id="question" name="question" /*type="textarea" rows={3}*/
                          label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.QUESTION")} background containerClass="my-0"
                          value={values.question} onChange={handleChange} onBlur={handleBlur}>
                  {!!touched.question && !!errors.question &&
                  <div className="text-left invalid-field">{errors.question}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6" className="mt-3">
                <MDBSelect label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.TYPE")} className="mt-3 mb-0 white"
                           selected={values.type} getValue={val => {
                  helpers.triggerChangeEvent("type", val[0])
                }}>
                  <MDBSelectInput/>
                  <MDBSelectOptions>
                    <MDBSelectOption
                      value={QUESTIONNAIRE.QUESTION.TYPE.YES_NO}
                      checked={values.type === QUESTIONNAIRE.QUESTION.TYPE.YES_NO}>{t("COMMON.QUESTIONNAIRE.QUESTION_TYPE.YES_NO")}</MDBSelectOption>
                    <MDBSelectOption
                      value={QUESTIONNAIRE.QUESTION.TYPE.SELECT}
                      checked={values.type === QUESTIONNAIRE.QUESTION.TYPE.SELECT}>{t("COMMON.QUESTIONNAIRE.QUESTION_TYPE.SELECT")}</MDBSelectOption>
                    <MDBSelectOption
                      value={QUESTIONNAIRE.QUESTION.TYPE.TEXT}
                      checked={values.type === QUESTIONNAIRE.QUESTION.TYPE.TEXT}>{t("COMMON.QUESTIONNAIRE.QUESTION_TYPE.TEXT")}</MDBSelectOption>
                  </MDBSelectOptions>
                </MDBSelect>
                {!!touched.location && !!errors.location &&
                <div className="text-left invalid-field">{errors.location}</div>}
              </MDBCol>
            </MDBRow>
            {values.type === QUESTIONNAIRE.QUESTION.TYPE.SELECT && <MDBRow>
              <MDBCol md="12">
                <MDBInput id="answers" name="answers" /*type="textarea" rows={3}*/
                          /*label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.ANSWERS")}*/ placeHolder={t("HIRE.WORKPLACE.QUESTIONNAIRE.QUESTIONS.ANSWERS_PLACEHOLDER")} background containerClass="mb-0"
                          value={values.answers} onChange={handleChange} onBlur={handleBlur}>
                  {!!touched.answers && !!errors.answers &&
                  <div className="text-left invalid-field">{errors.answers}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>}
            <MDBRow>
              <MDBCol md="12">
                <MDBInput id="required" name="required" label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.REQUIRED")} containerClass="mt-3" type="checkbox" filled checked={values.required} onChange={handleChange} onBlur={handleBlur}>
                  {!!touched.required && !!errors.required &&
                  <div className="text-left invalid-field">{errors.required}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <MDBInput id="hasCorrectAnswer" name="hasCorrectAnswer" label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.HAS_CORRECT_ANSWER")} containerClass="mt-3" type="checkbox" filled checked={values.hasCorrectAnswer} onChange={handleChange} onBlur={handleBlur}>
                  {!!touched.hasCorrectAnswer && !!errors.hasCorrectAnswer &&
                  <div className="text-left invalid-field">{errors.hasCorrectAnswer}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>
            {values.hasCorrectAnswer && values.type === QUESTIONNAIRE.QUESTION.TYPE.YES_NO && <MDBRow>
              <MDBCol md="6" className="mt-0">
                <MDBSelect label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.CORRECT_ANSWER")} className="mt-4 mb-0 white"
                           selected={values.correctAnswer} getValue={val => {
                  helpers.triggerChangeEvent("correctAnswer", val[0])
                }}>
                  <MDBSelectInput/>
                  <MDBSelectOptions>
                    <MDBSelectOption
                      value={QUESTIONNAIRE.ANSWER.YES}
                      checked={values.correctAnswer === QUESTIONNAIRE.ANSWER.YES}>{t("COMMON.BUTTON.YES")}</MDBSelectOption>
                    <MDBSelectOption
                      value={QUESTIONNAIRE.ANSWER.NO}
                      checked={values.correctAnswer === QUESTIONNAIRE.ANSWER.NO}>{t("COMMON.BUTTON.NO")}</MDBSelectOption>
                  </MDBSelectOptions>
                </MDBSelect>
                {!!touched.correctAnswer && !!errors.correctAnswer &&
                <div className="text-left invalid-field">{errors.correctAnswer}</div>}
              </MDBCol>
            </MDBRow>}
            {values.hasCorrectAnswer && values.type === QUESTIONNAIRE.QUESTION.TYPE.SELECT && <MDBRow>
              <MDBCol md="6" className="mt-0">
                <MDBSelect label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.CORRECT_ANSWER")} className="mt-4 mb-0 white"
                           selected={values.correctAnswer} getValue={val => {
                  helpers.triggerChangeEvent("correctAnswer", val[0])
                }}>
                  <MDBSelectInput/>
                  <MDBSelectOptions>
                    {answerItems.map((item, index) => (
                      <MDBSelectOption
                        key={index}
                        value={item}
                        checked={values.correctAnswer === item}>{item}</MDBSelectOption>
                    ))}
                  </MDBSelectOptions>
                </MDBSelect>
                {!!touched.correctAnswer && !!errors.correctAnswer &&
                <div className="text-left invalid-field">{errors.correctAnswer}</div>}
              </MDBCol>
            </MDBRow>}
            {values.hasCorrectAnswer && values.type === QUESTIONNAIRE.QUESTION.TYPE.TEXT && <MDBRow>
              <MDBCol md="12">
                <MDBInput id="correctAnswer" name="correctAnswer" label={t("HIRE.WORKPLACE.QUESTIONNAIRE.FIELDS.CORRECT_ANSWER")} containerClass="mt-3" background value={values.correctAnswer} onChange={handleChange} onBlur={handleBlur}>
                  {!!touched.correctAnswer && !!errors.correctAnswer &&
                  <div className="text-left invalid-field">{errors.correctAnswer}</div>}
                </MDBInput>
              </MDBCol>
            </MDBRow>}
          </form>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" size="sm" rounded onClick={e => setModal1Open(!modal1Open)}>Close</MDBBtn>
          <MDBBtn color="primary" size="sm" rounded onClick={formikProps.handleSubmit} disabled={!!isSubmitting}>{t("COMMON.BUTTON.SAVE")}</MDBBtn>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal isOpen={modal2Open} toggle={e => {}} centered>
        <MDBModalHeader
          toggle={e => setModal2Open(!modal2Open)}>{modal2.title}</MDBModalHeader>
        <MDBModalBody className="text-left">{modal2.message}</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="button" color="secondary" size="sm" rounded onClick={e => setModal2Open(!modal2Open)}>{t("COMMON.BUTTON.CANCEL")}</MDBBtn>
          <MDBBtn type="button" color="danger" size="sm" rounded onClick={deleteItem}>{t("COMMON.BUTTON.DELETE")}</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </div>
  );

  return payload();
};

Questions.propTypes = {
  items: PropTypes.array.isRequired,
  onItemsChanged: PropTypes.func.isRequired,
  // questionnaireId: PropTypes.number.isRequired,
  onLoading: PropTypes.func.isRequired,
};

export default Questions;
