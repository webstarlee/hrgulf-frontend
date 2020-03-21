import React, {Fragment, useEffect, useState} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBRow, MDBStep, MDBStepper} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";

import minifiedProfileActions from "actions/minified-profile";
import {DEFAULT} from "core/globals";
import Loader from "components/partial/Loader";
import Position from "./partial/Position";
import JobKind from "./partial/JobKind";
import Education from "./partial/Education";
import Contact from "./partial/Contact";

import "./MinifiedProfile.scss";

export default ({backLink}) => {
  const {t} = useTranslation();
  const {auth: {user, work}, minifiedProfile: {step, pendingStep}} = useSelector(state => state);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const goToNextStep = e => {
    dispatch(minifiedProfileActions.setStep({
      step: step + 1,
      pendingStep: pendingStep > step ? pendingStep : step + 1,
    }));
  };

  const goToPrevStep = e => {
    dispatch(minifiedProfileActions.setStep({
      step: step - 1,
      pendingStep,
    }));
  };

  const makeStepButton = number => (
    <a>
      <MDBBtn color={step >= number ? "primary" : "mdb-color"} circle onClick={handleStepClick(number)} disabled={pendingStep < number}>
        {step > number ? <MDBIcon icon="check"/> : number}
      </MDBBtn>
    </a>
  );

  const handleStepClick = step => e => {
    if (step <= pendingStep) {
      dispatch(minifiedProfileActions.setStep({
        step: step,
        pendingStep,
      }));
    }
  };

  useEffect(e => {
    setLoading(true);
    dispatch(minifiedProfileActions.setValues({
      // jobRoleId: work.jobRoleId || 0,
      // jobTitle: work.jobTitle || "",
      // companyName: work.companyName || "",
      // startDate: work.startDate || new Date().toDateString(),
      // endDate: work.endDate || new Date().toDateString(),
      // isPresent: work.isPresent || 0,
      // jobLocationId: work.jobLocationId || 0,
      // companySectorId: work.companySectorId || 0,
      // companyIndustryId: work.companyIndustryId || 0,
      // jobVisaStatusId: work.jobVisaStatusId || 0,
      // careerLevel: work.careerLevel || 0,
      // degree: work.degree || "",
      // university: work.university || "",
      // majorId: work.majorId || "",
      // graduatedDate: work.graduatedDate || "",
      // gradeId: work.gradeId || "",
      // birthday: user.birthday || new Date().toDateString,
      // gender: user.gender || "",
      // nationalityId: user.nationalityId || 5,
      // countryId: user.countryId || 5,
      // cityId: user.cityId || 5,
      // countryCode: user.countryCode || DEFAULT.USER.COUNTRY_CODE,
      // phone: `${user.countryCode}${user.phone}`,
      // visaStatusId: user.visaStatusId || "",
      step: 4,
      pendingStep: 4,
      jobRoleId: work.jobRoleId || 0,
      jobTitle: "Web Developer",
      companyName: "Wangzi",
      startDate: "2016-1-1",
      endDate: "2020-3-4",
      isPresent: 1,
      jobLocationId: 3,
      companySectorId: 1,
      companyIndustryId: 5,
      jobVisaStatusId: 1,
      careerLevel: 3,
      degree: 3,
      university: "Havard University",
      majorId: 3,
      graduatedDate: "2017-3-4",
      gradeId: 1,
      birthday: user.birthday || new Date().toDateString,
      gender: user.gender || "",
      nationalityId: user.nationalityId || 5,
      countryId: user.countryId || 5,
      cityId: user.cityId || 5,
      countryCode: user.countryCode || DEFAULT.USER.COUNTRY_CODE,
      phone: `${user.countryCode}${user.phone}`,
      visaStatusId: 1,
    }));
    setLoading(false);
  }, []);

  const payload = () => (
    <Fragment>
      {!!loading && <Loader/>}
      {!loading && <Fragment>
        <MDBStepper form>
          <MDBStep form>
            {makeStepButton(1)}
            <p>{t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.STEPS.POSITION")}</p>
          </MDBStep>
          <MDBStep form>
            {makeStepButton(2)}
            <p>{t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.STEPS.JOB_KIND")}</p>
          </MDBStep>
          <MDBStep form>
            {makeStepButton(3)}
            <p>{t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.STEPS.EDUCATION")}</p>
          </MDBStep>
          <MDBStep form>
            {makeStepButton(4)}
            <p>{t("WORK.MY_ACCOUNT.MINIFIED_PROFILE.STEPS.CONTACT")}</p>
          </MDBStep>
        </MDBStepper>
        <MDBCard>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="12">
                {step === 1 && <Position onNext={goToNextStep}/>}
                {step === 2 && <JobKind onPrev={goToPrevStep} onNext={goToNextStep}/>}
                {step === 3 && <Education onPrev={goToPrevStep} onNext={goToNextStep}/>}
                {step === 4 && <Contact onPrev={goToPrevStep}/>}
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </Fragment>}
    </Fragment>
  );

  return payload();
};
