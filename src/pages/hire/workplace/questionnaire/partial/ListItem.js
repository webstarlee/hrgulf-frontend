import React from "react";
import {MDBBtn, MDBCardBody, MDBCol, MDBMask, MDBView} from "mdbreact";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Base64} from "js-base64";

import "./ListItem.scss";

export default ({data, page, detailLabel, detailLink, deleteLabel, onDelete, questionsLink, questionsLabel}) => {
  const {t} = useTranslation();

  const {name, description} = data;
  const linkParam = Base64.encode(JSON.stringify({
    id: data.id,
    page,
  }));

  const payload = () => (
    <MDBCol md="6" lg="4" className="mb-3 mb-md-4">
      <MDBView hover className="card">
        <MDBCardBody className="letter-item-wrapper">
          <div className="letter-inner-wrapper">
            {/*<h4 className="h4-responsive">{type}</h4>*/}
            <div className="border-dark border-bottom mb-sm-1 mb-md-2"><span className="h4-responsive">{name}</span></div>
            <div className="letter-content" dangerouslySetInnerHTML={{__html: description}}/>
          </div>
        </MDBCardBody>
        <MDBMask className="flex-center" overlay="grey-strong">
          <Link to={`${detailLink}/${linkParam}`} className="text-body">
            <MDBBtn color="primary" size="sm" className="white-text" rounded>{detailLabel}</MDBBtn>
          </Link>
          <MDBBtn color="danger" size="sm" onClick={e => onDelete({id: data.id, item: data.name})} rounded>{deleteLabel}</MDBBtn>
          <Link to={`${questionsLink}/${linkParam}`} className="text-body">
            <MDBBtn color="indigo" size="sm" className="white-text" rounded>{questionsLabel}</MDBBtn>
          </Link>
        </MDBMask>
      </MDBView>
    </MDBCol>
  );

  return payload();
};
