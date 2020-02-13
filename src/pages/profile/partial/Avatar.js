import React, {Fragment, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {MDBAlert, MDBBtn} from "mdbreact";
import MDBFileupload from "mdb-react-fileupload";
import {CSSTransition} from "react-transition-group";

import {ALERT, FILE_UPLOAD, RESULT, EFFECT,} from "core/globals";
import apis from "core/apis";
import Service from "services/ProfileService";

import "./Avatar.scss";

export default () => {
  const {t} = useTranslation();
  const {auth} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [avatar, setAvatar] = useState("")
  const [file, setFile] = useState();

  const extensions = ["jpg", "jpeg", "png"];


  useEffect(e => {
    setLoading(true);
    Service.avatar({userId: auth.user.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setAvatar(`${apis.assetsBaseUrl}${res.data}`);
        } else {
          setAvatar("");
        }
        setLoading(false);
      })
      .catch(err => {
        setAvatar("");
        setLoading(false);
      });
  }, [t]);

  const handleSubmit = e => {
    let params = new FormData();
    params.append("userId", auth.user.id);
    params.append("file", file);
    Service.saveAvatar(params)
      .then(res => {
        setAlert({
          show: true,
          color: res.result,
          message: res.message,
        });
      })
      .catch(err => {
        setAlert({
          show: true,
          color: ALERT.DANGER,
          message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
        });
      });
  };

  return (
    <Fragment>
      {!loading && <Fragment>
        <MDBFileupload defaultFileSrc={avatar} getValue={setFile} showRemove={false} maxFileSize={FILE_UPLOAD.MAXSIZE1} allowedFileExtensions={extensions} messageDefault={t("COMMON.FILE_UPLOAD.DEFAULT")} messageReplace={t("COMMON.FILE_UPLOAD.REPLACE")} messageRemove={t("COMMON.FILE_UPLOAD.REMOVE")} messageError={t("COMMON.FILE_UPLOAD.ERROR")} errorFileSize={t("COMMON.FILE_UPLOAD.ERROR_FILESIZE", {max: FILE_UPLOAD.MAXSIZE1})} errorFileExtension={t("COMMON.FILE_UPLOAD.ERROR_FILEEXTENSION", {extensions: extensions.join(", ")})} />
        <div className="text-center mb-4">
          <MDBBtn size="sm" color="indigo" rounded disabled={!file} onClick={handleSubmit}>{t("COMMON.BUTTON.SAVE")}</MDBBtn>
        </div>
        <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>
          <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>
        </CSSTransition>
      </Fragment>}
    </Fragment>
  )
}
