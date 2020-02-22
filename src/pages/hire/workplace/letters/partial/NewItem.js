import React from "react";
import {MDBBtn, MDBCardBody, MDBCol, MDBIcon, MDBMask, MDBView} from "mdbreact";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

import "./NewItem.scss";

export default ({to}) => {
  const {t} = useTranslation();

  const payload = () => (
    <MDBCol md="6" lg="4" className="mb-3 mb-md-4">
      <Link to={to} className="text-body">
        <MDBView hover className="card">
          <MDBCardBody className="letter-item-wrapper">
            <div className="letter-inner-wrapper">
              <div className="border-dark border-bottom mb-sm-1 mb-md-2"><span className="h4-responsive">{t("COMMON.BUTTON.ADD_NEW_ITEM")}</span></div>
              <div className="letter-content">{t("HIRE.WORKPLACE.LETTERS.ALL.NEW_ITEM_DESCRIPTION")}</div>
            </div>
          </MDBCardBody>
          <MDBMask className="flex-center" overlay="grey-strong">
            {/*<Link to={to} className="text-body">*/}
              <MDBBtn color="primary" size="sm" className="white-text" rounded>
                <MDBIcon icon="plus" size="sm" />
              </MDBBtn>
            {/*</Link>*/}
          </MDBMask>
        </MDBView>
      </Link>
    </MDBCol>
  );

  return payload();
};
