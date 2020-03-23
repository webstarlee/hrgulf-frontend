import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import {MDBBreadcrumb, MDBBreadcrumbItem, MDBCol, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";

import routes from "core/routes";
import {RESULT} from "core/globals";
import CoreService from "services/CoreService";
import Summary from "./partial/Summary";
import PersonalInformation from "./partial/PersonalInformation";
import WorkInformation from "./partial/WorkInformation";

import "./RootPage.scss";

export default () => {
  const {t} = useTranslation();

  const [countries, setCountries] = useState([]);
  // const [allCities, setAllCities] = useState([]);
  const [rawJobRoles, setRawJobRoles] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [rawSectors, setRawSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [visaStatuses, setVisaStatuses] = useState([]);
  const [careerLevels, setCareerLevels] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [rawMajors, setRawMajors] = useState([]);
  const [majors, setMajors] = useState([]);
  const [grades, setGrades] = useState([]);
  const [countries2, setCountries2] = useState({});
  const [allCities2, setAllCities2] = useState({});
  const [jobRoles2, setJobRoles2] = useState({});
  const [sectors2, setSectors2] = useState({});
  const [allIndustries2, setAllIndustries2] = useState({});
  const [visaStatuses2, setVisaStatuses2] = useState({});
  const [careerLevels2, setCareerLevels2] = useState({});
  const [degrees2, setDegrees2] = useState({});
  const [majors2, setMajors2] = useState({});
  const [grades2, setGrades2] = useState({});

  const lang = t("CODE");
  const pageTitle = t("NAVBAR.WORK.MY_CV.MY_CV");

  const loadCountries = () => {
    CoreService.getCountries()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.id] = {
              country_en: item.country_en,
              country_ar: item.country_ar,
            }
          }
          setCountries(res.data);
        } else {
          setCountries([]);
        }
        setCountries2(items);
      })
      .catch(err => {
        setCountries([]);
        setCountries2({});
      });
  };

  const loadAllCities = () => {
    CoreService.getCities()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.id] = {
              city_en: item.city_en,
              city_ar: item.city_ar,
            }
          }
          setAllCities2(items);
        } else {
          setAllCities2({});
        }
      })
      .catch(err => {
        setAllCities2({});
      });
  };

  const loadJobRoles = () => {
    CoreService.getJobRoles()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.id] = {
              jobRole_en: item.jobRole_en,
              jobRole_ar: item.jobRole_ar,
            }
          }
          setRawJobRoles(res.data);
          setJobRoles2(items);
        } else {
          setRawJobRoles([]);
          setJobRoles2({});
        }
      })
      .catch(err => {
        setRawJobRoles([]);
        setJobRoles2({});
      });
  };

  const loadSectors = () => {
    CoreService.getSectors()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.id] = {
              sector_en: item.sector_en,
              sector_ar: item.sector_ar,
            }
          }
          setRawSectors(res.data);
          setSectors2(items);
        } else {
          setRawSectors([]);
          setSectors2({});
        }
      })
      .catch(err => {
        setRawSectors([]);
        setSectors2({});
      });
  };

  const loadAllIndustries = () => {
    CoreService.getIndustries()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.id] = {
              industry_en: item.industry_en,
              industry_ar: item.industry_ar,
            }
          }
          setAllIndustries2(items);
        } else {
          setAllIndustries2({});
        }
      })
      .catch(err => {
        setAllIndustries2({});
      });
  };

  const loadVisaStatuses = () => {
    CoreService.getVisaStatuses()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.id] = {
              visaStatus_en: item.visaStatus_en,
              visaStatus_ar: item.visaStatus_ar,
            }
          }
          setVisaStatuses(res.data);
          setVisaStatuses2(items);
        } else {
          setVisaStatuses([]);
          setVisaStatuses2({});
        }
      })
      .catch(err => {
        setVisaStatuses([]);
        setVisaStatuses2({});
      });
  };

  const loadCareerLevels = () => {
    CoreService.getCareerLevels()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.level] = {
              careerLevel_en: item.careerLevel_en,
              careerLevel_ar: item.careerLevel_ar,
            }
          }
          setCareerLevels(res.data);
          setCareerLevels2(items);
        } else {
          setCareerLevels([]);
          setCareerLevels2({});
        }
      })
      .catch(err => {
        setCareerLevels([]);
        setCareerLevels2({});
      });
  };

  const loadDegrees = () => {
    CoreService.getDegrees()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.level] = {
              degree_en: item.degree_en,
              degree_ar: item.degree_ar,
            }
          }
          setDegrees(res.data);
          setDegrees2(items);
        } else {
          setDegrees([]);
          setDegrees2({});
        }
      })
      .catch(err => {
        setDegrees([]);
        setDegrees2({});
      });
  };

  const loadMajors = () => {
    CoreService.getMajors()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.id] = {
              major_en: item.major_en,
              major_ar: item.major_ar,
            }
          }
          setRawMajors(res.data);
          setMajors2(items);
        } else {
          setRawMajors([]);
          setMajors2({});
        }
      })
      .catch(err => {
        setRawMajors([]);
        setMajors2({});
      });
  };

  const loadGrades = () => {
    CoreService.getGrades()
      .then(res => {
        const items = {};
        if (res.result === RESULT.SUCCESS) {
          for (let item of res.data) {
            items[item.id] = {
              grade_en: item.grade_en,
              grade_ar: item.grade_ar,
            }
          }
          setGrades(res.data);
          setGrades2(items);
        } else {
          setGrades([]);
          setGrades2({});
        }
      })
      .catch(err => {
        setGrades([]);
        setGrades2({});
      });
  };

  useEffect(() => {
    loadCountries();
    loadAllCities();
    loadJobRoles();
    loadSectors();
    loadAllIndustries();
    loadVisaStatuses();
    loadCareerLevels();
    loadDegrees();
    loadMajors();
    loadGrades();
  }, []);

  useMemo(e => {
    const items = [];
    for (let item of rawJobRoles) {
      items.push({
        value: item.id,
        text: item[`jobRole_${lang}`],
        lowercase: item[`jobRole_${lang}`].toLowerCase(),
      });
    }
    setJobRoles(items);
  }, [t, rawJobRoles]);

  useMemo(e => {
    const items = [];
    for (let item of rawSectors) {
      items.push({
        value: item.id,
        text: item[`sector_${lang}`],
        lowercase: item[`sector_${lang}`].toLowerCase(),
      });
    }
    setSectors(items);
  }, [t, rawSectors]);

  useMemo(e => {
    const items = [];
    for (let item of rawMajors) {
      items.push({
        value: item.id,
        text: item[`major_${lang}`],
        lowercase: item[`major_${lang}`].toLowerCase(),
      });
    }
    setMajors(items);
  }, [t, rawMajors]);

  const payload = () => (
    <Fragment>
      <Helmet>
        <title>{pageTitle} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBBreadcrumb>
        <MDBBreadcrumbItem><Link to={routes.work.myCV.myCV}>{t("NAVBAR.WORK.MY_CV.ROOT")}</Link></MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{pageTitle}</MDBBreadcrumbItem>
      </MDBBreadcrumb>

      <MDBRow>
        <MDBCol md="12" className="text-left">
          <Summary countries={countries}/>
          <PersonalInformation countries={countries} countries2={countries2} allCities2={allCities2}/>
          <WorkInformation jobRoles={jobRoles} countries={countries} sectors={sectors} visaStatuses={visaStatuses} careerLevels={careerLevels} degrees={degrees} majors={majors} grades={grades} jobRoles2={jobRoles2} countries2={countries2} allCities2={allCities2} sectors2={sectors2} allIndustries2={allIndustries2} visaStatuses2={visaStatuses2} careerLevels2={careerLevels2} degrees2={degrees2} majors2={majors2} grades2={grades2}/>
        </MDBCol>
      </MDBRow>
    </Fragment>
  );

  return payload();
}
