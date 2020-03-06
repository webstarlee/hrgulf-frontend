import React, {Fragment, useEffect} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBRow, MDBStep, MDBStepper} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";

import myJobsActions from "actions/my-jobs";
import JobInformation from "./partial/JobInformation";
import CandidateRequirements from "./partial/CandidateRequirements";
import AddSpecialties from "./partial/AddSpecialties";
import AddQuestionnaire from "./partial/AddQuestionnaire";

import "./PostAJob.scss";

export default ({backLink}) => {
  const {t} = useTranslation();
  const {myJobs: {postAJob: {step, pendingStep}}} = useSelector(state => state);
  const dispatch = useDispatch();


  useEffect(e => {
  }, []);

  const goToNextStep = e => {
    dispatch(myJobsActions.postAJob.setStep({
      step: step + 1,
      pendingStep: pendingStep > step ? pendingStep : step + 1,
    }));
  };

  const goToPrevStep = e => {
    dispatch(myJobsActions.postAJob.setStep({
      step: step - 1,
      pendingStep,
    }));
  };

  const handleStepClick = step => e => {
    if (step <= pendingStep) {
      dispatch(myJobsActions.postAJob.setStep({
        step: step,
        pendingStep,
      }));
    }
  };
  
  const makeStepButton = number => (
    <a>
      <MDBBtn color={step >= number ? "primary" : "mdb-color"} circle onClick={handleStepClick(number)} disabled={pendingStep < number}>
        {step > number ? <MDBIcon icon="check"/> : number}
      </MDBBtn>
    </a>
  );

  const payload = () => (
    <Fragment>
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
                {step === 1 && <JobInformation backLink={backLink} onNext={goToNextStep}/>}
                {step === 2 && <CandidateRequirements onPrev={goToPrevStep} onNext={goToNextStep}/>}
                {step === 3 && <AddSpecialties onPrev={goToPrevStep} onNext={goToNextStep}/>}
                {step === 4 && <AddQuestionnaire onPrev={goToPrevStep}/>}
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </Fragment>
    </Fragment>
  );

  return payload();
};
