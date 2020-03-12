import React from "react";
import {MDBBadge, MDBBtn, MDBCardBody, MDBCol, MDBIcon, MDBMask, MDBView} from "mdbreact";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Base64} from "js-base64";

import Service from "services/hire/my-jobs/MyJobsService"
import "./ListItem.scss";

export default ({data, detailLabel, activateLabel, deactivateLabel, deleteLabel, page, onEdit, onActivate, onDelete}) => {
  const {t} = useTranslation();

  // const candicateType = t(`HIRE.WORKPLACE.LETTERS.TYPE.${data.candicateType}`);
  const {id, title, description, isActive} = data;

  const payload = () => (
    <MDBCol md="6" lg="4" className="mb-3 mb-md-4">
      <MDBView hover className="card">
        <MDBCardBody className="letter-item-wrapper">
          <div className="letter-inner-wrapper">
            <div className="border-dark border-bottom mb-sm-1 mb-md-2">
              <span className="h4-responsive">{title}</span>
              <MDBBadge pill color={isActive ? "success" : "danger"} className="ml-2">{t(`COMMON.JOB_STATUS.${isActive ? "ACTIVE" : "INACTIVE"}`)}</MDBBadge>
              {/*<p className="my-0">{t(`COMMON.JOB_STATUS.${isActive ? "ACTIVE" : "INACTIVE"}`)}</p>*/}
            </div>
            <div className="letter-content" dangerouslySetInnerHTML={{__html: description}}/>
          </div>
        </MDBCardBody>
        <MDBMask className="flex-center" overlay="grey-strong">
          <MDBBtn tag="a" floating color="primary" size="sm" rounded onClick={e => {}}>
            {/*{detailLabel}*/}
            <MDBIcon icon="eye"/>
          </MDBBtn>
          <MDBBtn tag="a" floating color="secondary" size="sm" rounded onClick={e => onEdit({id})}>
            {/*{detailLabel}*/}
            <MDBIcon icon="edit"/>
          </MDBBtn>
          <MDBBtn tag="a" floating color="danger" size="sm" onClick={e => onDelete({id, item: title})} rounded>
            {/*{deleteLabel}*/}
            <MDBIcon icon="trash"/>
          </MDBBtn>
          <MDBBtn tag="a" floating color={!!isActive ? "warning" : "success"} size="sm" onClick={e => onActivate({id, item: title, isActive: !isActive})} rounded>
            {/*{!!isActive ? deactivateLabel : activateLabel}*/}
            <MDBIcon icon={!!isActive ? "times" : "check"}/>
          </MDBBtn>
        </MDBMask>
      </MDBView>
    </MDBCol>
  );

  return payload();
};
