import React, {Fragment, useEffect, useRef, useState} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBRow} from "mdbreact";
import MDBFileupload from "mdb-react-fileupload";
import {useTranslation} from "react-i18next";
import ReactAvatarEditor from "react-avatar-editor";
import {useSelector} from "react-redux";

import {ALERT, AVATAR, FILE_UPLOAD, RESULT} from "core/globals";
import apis from "core/apis";
import Service from "services/AccountService";
import toast from "components/MyToast";

import "./Summary.scss";

export default ({countries}) => {
  const {t} = useTranslation();
  const {auth} = useSelector(state => state);
  const {user, work} = auth;

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [avatar, setAvatar] = useState({});

  const lang = t("CODE");
  const userId = auth.user.id;

  const loadData = () => {
    setLoading(true);
    Service.avatar({id: userId})
      .then(res => {
        setLoading(false);
        const data = res.data;
        if (res.result === RESULT.SUCCESS) {
          setAvatar({
            url: `${apis.assetsBaseUrl}${data.url}`,
            borderRadius: AVATAR.SIZE.WIDTH / 100 * data.borderRadius,
          });
        } else {
          setAlert({
            show: true,
            color: ALERT.DANGER,
            message: res.message,
          });
        }
      })
      .catch(err => {
        setLoading(false);
        setAlert({
          show: true,
          color: ALERT.DANGER,
          message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
        });
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const payload = () => (
    <MDBCard className="mt-3">
      <MDBCardBody>
        {/*<h4 className="h4-responsive text-left grey-text">{t("COMMON.FIELDS.AVATAR.AVATAR")}</h4>*/}
        <form>
          <div className="d-flex grey-text">
            <div className="text-left">
              <img className="my-avatar" src={avatar.url} alt={t("COMMON.FIELDS.AVATAR.AVATAR")} style={{borderRadius: avatar.borderRadius}}/>
            </div>
            <div className="ml-4 mt-4 text-left">
              <p className="font-weight-bold">{user.firstName} {user.fatherName} {user.lastName}</p>
              <p className="mt-2 mb-0">{work.jobTitle}</p>
              <p className="mt-2 mb-0">{work.companyName}</p>
              {!!countries && <p className="mt-4 mb-0">{t("COMMON.FIELDS.USER.LOCATION")}: {!!countries[user.countryId] && countries[user.countryId][`country_${lang}`]}</p>}
              <p className="mt-2 mb-0">{t("WORK.ACCOUNT.FIELDS.EDUCATION")}: {work.university}</p>
            </div>
          </div>
        </form>
      </MDBCardBody>
    </MDBCard>
  );

  return payload();
}
