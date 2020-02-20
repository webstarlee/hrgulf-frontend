import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBCol, MDBInput, MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions} from "mdbreact";
import _ from "lodash";

import {DELAY, LETTERS, SCOPE} from "core/globals";
import useDebounce from "../../../../../helpers/useDebounce";

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
          <MDBSelect label={t("HIRE.WORKPLACE.LETTERS.FIELDS.TYPE")} className="mt-sm-5 mt-md-3 mb-0"
                     selected={type} getValue={val => setType(val[0])}>
            <MDBSelectInput/>
            <MDBSelectOptions>
              <MDBSelectOption value={SCOPE.ALL} checked={type === SCOPE.ALL}>{t("COMMON.SCOPE.ALL")}</MDBSelectOption>
              <MDBSelectOption value={LETTERS.TYPE.GENERIC} checked={type === LETTERS.TYPE.GENERIC}>{t("HIRE.WORKPLACE.LETTERS.TYPE.GENERIC")}</MDBSelectOption>
              <MDBSelectOption value={LETTERS.TYPE.INTERVIEW} checked={type === LETTERS.TYPE.INTERVIEW}>{t("HIRE.WORKPLACE.LETTERS.TYPE.INTERVIEW")}</MDBSelectOption>
              <MDBSelectOption value={LETTERS.TYPE.FOLLOWUP} checked={type === LETTERS.TYPE.FOLLOWUP}>{t("HIRE.WORKPLACE.LETTERS.TYPE.FOLLOWUP")}</MDBSelectOption>
              <MDBSelectOption value={LETTERS.TYPE.ACCEPTANCE} checked={type === LETTERS.TYPE.ACCEPTANCE}>{t("HIRE.WORKPLACE.LETTERS.TYPE.ACCEPTANCE")}</MDBSelectOption>
              <MDBSelectOption value={LETTERS.TYPE.REJECTION} checked={type === LETTERS.TYPE.REJECTION}>{t("HIRE.WORKPLACE.LETTERS.TYPE.REJECTION")}</MDBSelectOption>
              <MDBSelectOption value={LETTERS.TYPE.ON_BOARDING} checked={type === LETTERS.TYPE.ON_BOARDING}>{t("HIRE.WORKPLACE.LETTERS.TYPE.ON_BOARDING")}</MDBSelectOption>
            </MDBSelectOptions>
          </MDBSelect>
        </MDBCol>
        <MDBCol md="6">
          <MDBInput id="name" name="name" label={t("COMMON.SEARCH.KEYWORD")} background
                    containerClass="mt-2 mb-0" value={keyword} getValue={setKeyword}/>
        </MDBCol>
      </MDBRow>
    </Fragment>
  );

  return payload();
};