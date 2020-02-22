import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {MDBCol, MDBInput, MDBRow, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions} from "mdbreact";
import _ from "lodash";

import {DELAY, LETTERS, SCOPE} from "core/globals";
import useDebounce from "../../../../../helpers/useDebounce";

export default ({onChangeKeyword}) => {
  const {t} = useTranslation();

  const [enabled, setEnabled] = useState(false);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, DELAY.DELAY2);

  useEffect(e => {
    const handle = setTimeout(e => {
      setEnabled(true);
      clearTimeout(handle);
    }, DELAY.DELAY2);
  }, []);

  useMemo(e => {
    if (typeof onChangeKeyword === "function") {
      enabled && onChangeKeyword(debouncedKeyword);
    }
  }, [debouncedKeyword]);

  const payload = () => (
    <Fragment>
      <MDBRow>
        <MDBCol md="6">
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