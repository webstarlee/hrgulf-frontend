import React, {Fragment, useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import MDBFileupload from "mdb-react-fileupload";
import {useTranslation} from "react-i18next";
import {animateScroll as scroll} from "react-scroll";
import {useSelector} from "react-redux";

import {ALERT, AVATAR, EFFECT, FILE_UPLOAD, RESULT} from "core/globals";
import apis from "core/apis";
import Loading from "components/Loading";
import toast from "components/MyToast";
import Service from "services/hire/workplace/MyCompanyProfilesService";

export default () => {
  const {t} = useTranslation();
  const {auth: {user}} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [coverPhoto, setCoverPhoto] = useState("");
  const [file, setFile] = useState();

  const extensions = ["jpg", "jpeg", "png"];

  const loadData = () => {
    setLoading(true);
    Service.loadCoverPhoto({id: user.id})
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          const data = res.data;
          setCoverPhoto(`${apis.assetsBaseUrl}${data.coverPhoto}`);
          setAlert({});
        } else {
          setAlert({
            show: true,
            color: ALERT.DANGER,
            message: res.message,
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setAlert({
          show: true,
          color: ALERT.DANGER,
          message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
        });
        setLoading(false);
      });
  };

  const handleSubmit = e => {
    setLoading(true);
    const params = new FormData();
    params.append("id", user.id);
    !!file && params.append("file", file);
    Service.saveCoverPhoto(params)
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          const data = res.data;
          setCoverPhoto(`${apis.assetsBaseUrl}${data.coverPhoto}`);
          setIsEditing(false);
        } else {
          toast.error(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
        setLoading(false);
      });
  };

  useEffect(e => {
    scroll.scrollToTop({
      duration: EFFECT.TRANSITION_TIME,
    });

    loadData();
  }, []);

  const payload = () => (
    <div className="mt-3">
      {/*{alert.show && <MDBCol md="12">*/}
      {/*  <CSSTransition in={alert.show} classNames="fade-transition" timeout={EFFECT.TRANSITION_TIME} unmountOnExit appear>*/}
      {/*    <MDBAlert color={alert.color} dismiss onClosed={() => setAlert({})}>{alert.message}</MDBAlert>*/}
      {/*  </CSSTransition>*/}
      {/*</MDBCol>}*/}
      <form className="text-left" onSubmit={handleSubmit}>
        <MDBRow>
          <MDBCol>
            <h4
              className="h4-responsive text-left grey-text mr-auto pt-1">{t("HIRE.WORKPLACE.MY_COMPANY_PROFILES.COVER_PHOTO")}</h4>
          </MDBCol>
          <MDBCol>
            <div className="text-right ml-auto mr-md-4">
              {!!isEditing && <MDBBtn type="submit" tag="a" floating color="primary" size="sm" rounded className="my-0"
                                      disabled={!!loading} onClick={handleSubmit}>
                <MDBIcon icon="save" size="lg" />
              </MDBBtn>}
              {!!isEditing && <MDBBtn type="button" tag="a" floating color="warning" size="sm" rounded className="my-0"
                                      disabled={!!loading}
                                      onClick={e => setIsEditing(false)}>
                <MDBIcon icon="times" size="lg" />
              </MDBBtn>}
              {!isEditing && <MDBBtn type="button" tag="a" floating color="warning" size="sm" rounded className="my-0"
                                     disabled={!!loading}
                                     onClick={e => setIsEditing(true)}>
                <MDBIcon icon="edit" size="lg" />
              </MDBBtn>}
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12">
            {!!loading && <Loading style={{height: 274}}/>}
            {!loading && <Fragment>
            {/*{<Fragment>*/}
              <div className="mx-md-4 mx-sm-1 ">
                <MDBRow>
                  <MDBCol md="12">
                    <div id="file" className=" md-form mx-auto md-bg mt-2 mb-0">
                      {!loading && <MDBFileupload
                        // ref={fileRef}
                        disabled={!isEditing}
                        defaultFileSrc={coverPhoto}
                        getValue={setFile}
                        showRemove={false}
                        maxFileSize={FILE_UPLOAD.MAXSIZE1}
                        maxFileSizePreview={FILE_UPLOAD.MAXSIZE1}
                        containerHeight={AVATAR.SIZE.HEIGHT + 50}
                        allowedFileExtensions={extensions}
                        messageDefault={t("COMMON.FILE_UPLOAD.DEFAULT")}
                        messageReplace={t("COMMON.FILE_UPLOAD.REPLACE")}
                        messageRemove={t("COMMON.FILE_UPLOAD.REMOVE")}
                        messageError={t("COMMON.FILE_UPLOAD.ERROR")}
                        errorFileSize={t("COMMON.FILE_UPLOAD.ERROR_FILESIZE", {max: FILE_UPLOAD.MAXSIZE1})}
                        errorFileExtension={t("COMMON.FILE_UPLOAD.ERROR_FILEEXTENSION", {extensions: extensions.join(", ")})}
                      />}
                    </div>
                  </MDBCol>
                </MDBRow>
              </div>
            </Fragment>}
          </MDBCol>
        </MDBRow>
      </form>
    </div>
  );

  return payload();
};
