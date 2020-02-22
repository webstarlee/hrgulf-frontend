import React, {Fragment} from "react";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import {useTranslation} from "react-i18next";

import ErrorNoData from "components/ErrorNoData";

export default ({items}) => {
  const {t} = useTranslation();

  const payload = () => (
    <div className="text-left">
      <MDBTable responsive striped>
        <MDBTableHead>
          <tr className="">
            <th className="nomer-col">#</th>
            <th>{t("HIRE.WORKPLACE.QUESTIONNAIRE.QUESTIONS.FIELDS.QUESTION")}</th>
            <th className="p-2 edit-col-2"/>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {!!items.length && items.map((item, index) => (
            <tr key={index} className="">
              <td>{item.number}</td>
              <td>{item.question}</td>
              <td className="edit-col">{item.button}</td>
            </tr>
          ))}
          {!items.length && <ErrorNoData/>}
        </MDBTableBody>
      </MDBTable>
    </div>
  );

  return payload();
};
