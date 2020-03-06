import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBCol, MDBInput, MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions} from "mdbreact";

import {DELAY, JOB_STATUS, LETTERS, SCOPE} from "core/globals";
import useDebounce from "helpers/useDebounce";

export default ({onChangeType, onChangeKeyword}) => {
  const {t} = useTranslation();

  const [enabled, setEnabled] = useState(false);
  const [type, setType] = useState(SCOPE.ALL);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, DELAY.DELAY2);

  useEffect(e => {
    const handle = setTimeout(e => {
      setEnabled(true);
      clearTimeout(handle);
    }, DELAY.DELAY2);
  }, []);

  useMemo(e => {
    if (typeof onChangeType === "function") {
      enabled && onChangeType(type);
    }
  }, [type]);

  useMemo(e => {
    if (typeof onChangeKeyword === "function") {
      enabled && onChangeKeyword(debouncedKeyword);
    }
  }, [debouncedKeyword]);

  const payload = () => (
    <Fragment>
      <MDBRow>
        <MDBCol md="6">
          <MDBSelect label={t("HIRE.MY_JOBS.MY_JOBS.FIELDS.TYPE")} outline className="mt-sm-5 mt-md-3 mb-0"
                     selected={type} getValue={val => setType(val[0])}>
            <MDBSelectInput/>
            <MDBSelectOptions>
              <MDBSelectOption value={SCOPE.ALL} checked={type == SCOPE.ALL}>{t("COMMON.SCOPE.ALL")}</MDBSelectOption>
              <MDBSelectOption value={JOB_STATUS.ACTIVE} checked={type == JOB_STATUS.ACTIVE}>{t("COMMON.JOB_STATUS.ACTIVE")}</MDBSelectOption>
              <MDBSelectOption value={JOB_STATUS.INACTIVE} checked={type == JOB_STATUS.INACTIVE}>{t("COMMON.JOB_STATUS.INACTIVE")}</MDBSelectOption>
            </MDBSelectOptions>
          </MDBSelect>
        </MDBCol>
        <MDBCol md="6">
          <MDBInput id="name" name="name" label={t("COMMON.SEARCH.KEYWORD")} outline
                    containerClass="mt-3 mb-0" value={keyword} getValue={setKeyword}/>
        </MDBCol>
      </MDBRow>
    </Fragment>
  );

  return payload();
};