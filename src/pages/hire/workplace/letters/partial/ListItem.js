import React from "react";
import {MDBBtn, MDBCardBody, MDBCol, MDBMask, MDBView} from "mdbreact";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Base64} from "js-base64";

import "./ListItem.scss";

export default ({data, detailLabel, detailLink, deleteLabel, page, onDelete}) => {
  const {t} = useTranslation();

  const type = t(`HIRE.WORKPLACE.LETTERS.TYPE.${data.type}`);
  const {id, name, subject, message} = data;
  const detailLinkParam = Base64.encode(JSON.stringify({
    id,
    page,
  }));

  const payload = () => (
    <MDBCol md="6" lg="4" className="mb-3 mb-md-4">
      <MDBView hover className="card">
        <MDBCardBody className="letter-item-wrapper">
          <div className="letter-inner-wrapper">
            {/*<h4 className="h4-responsive">{type}</h4>*/}
            <div className="border-dark border-bottom mb-sm-1 mb-md-2"><span className="h4-responsive">{name}</span> - {type}</div>
            <div className="letter-content" dangerouslySetInnerHTML={{__html: message}}/>
          </div>
        </MDBCardBody>
        <MDBMask className="flex-center" overlay="grey-strong">
          <Link to={`${detailLink}/${detailLinkParam}`} className="text-body">
            <MDBBtn color="primary" size="sm" className="white-text" rounded>{detailLabel}</MDBBtn>
          </Link>
          <MDBBtn color="danger" size="sm" onClick={e => onDelete({id: id, item: name})} rounded>{deleteLabel}</MDBBtn>
        </MDBMask>
      </MDBView>
    </MDBCol>
  );

  return payload();
};
