import React, {Fragment, useEffect, useState} from "react";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBRow,
  MDBStep,
  MDBStepper,
  ToastContainer
} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useDispatch, useSelector} from "react-redux";

import myJobsActions from "actions/my-jobs";
import {EFFECT} from "core/globals";
import {Fade} from "components/MyToast";
import JobInformation from "./partial/JobInformation";
import CandidateRequirements from "./partial/CandidateRequirements";
import AddSpecialties from "./partial/AddSpecialties";
import AddQuestionnaire from "./partial/AddQuestionnaire";

import "./MainPage.scss";

export default (props) => {
  const {t} = useTranslation();
  const {myJobs: {postAJob: {step, pendingStep}}} = useSelector(state => state);
  const dispatch = useDispatch();

  // const [step, setStep] = useState(3);
  // const [pendingStep, setPendingStep] = useState(3);


  useEffect(e => {
  }, [props]);

  const goToNextStep = e => {
    dispatch(myJobsActions.postAJob.setStep({
      step: step + 1,
      pendingStep: pendingStep > step ? pendingStep : step + 1,
    }));
    // pendingStep === step && setPendingStep(step + 1);
    // setStep(step + 1);
  };

  const goToPrevStep = e => {
    dispatch(myJobsActions.postAJob.setStep({
      step: step - 1,
      pendingStep,
    }));
    // setStep(step - 1);
  };

  const handleStepClick = step => e => {
    if (step <= pendingStep) {
      dispatch(myJobsActions.postAJob.setStep({
        step: step,
        pendingStep,
      }));
      // setStep(step);
    }
  };

  const pageTitle = t("NAVBAR.HIRE.MY_JOBS.POST_A_JOB");
  
  const makeStepButton = number => (
    <a>
      <MDBBtn color={step >= number ? "primary" : "mdb-color"} circle onClick={handleStepClick(number)} disabled={pendingStep < number}>
        {step > number ? <MDBIcon icon="check"/> : number}
      </MDBBtn>
    </a>
  );

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem>{t("NAVBAR.HIRE.MY_JOBS.ROOT")}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>
      <Fragment>
        <MDBStepper form>
          <MDBStep form>
            {makeStepButton(1)}
            <p>{t("HIRE.MY_JOBS.POST_A_JOB.STEPS.JOB_INFORMATION")}</p>
          </MDBStep>
          <MDBStep form>
            {makeStepButton(2)}
            <p>{t("HIRE.MY_JOBS.POST_A_JOB.STEPS.CANDIDATE_REQUIREMENTS")}</p>
          </MDBStep>
          <MDBStep form>
            {makeStepButton(3)}
            <p>{t("HIRE.MY_JOBS.POST_A_JOB.STEPS.ADD_SPECIALTIES")}</p>
          </MDBStep>
          <MDBStep form>
            {makeStepButton(4)}
            <p>{t("HIRE.MY_JOBS.POST_A_JOB.STEPS.ADD_QUESTIONNAIRE")}</p>
          </MDBStep>
        </MDBStepper>
        <MDBCard>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="12">
                {step === 1 && <JobInformation onNext={goToNextStep}/>}
                {step === 2 && <CandidateRequirements onPrev={goToPrevStep} onNext={goToNextStep}/>}
                {step === 3 && <AddSpecialties onPrev={goToPrevStep} onNext={goToNextStep}/>}
                {step === 4 && <AddQuestionnaire onPrev={goToPrevStep}/>}
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </Fragment>
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
