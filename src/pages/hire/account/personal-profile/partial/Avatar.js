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

import "./Avatar.scss";

export default (props) => {
  const {t} = useTranslation();
  const {auth} = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [url, setUrl] = useState("");
  const [originUrl, setOriginUrl] = useState("");
  const [file, setFile] = useState();
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(AVATAR.SIZE.WIDTH);
  const [height, setHeight] = useState(AVATAR.SIZE.HEIGHT);
  const [borderRadius, setBorderRadius] = useState(0);
  const [position, setPosition] = useState({x: 0.5, y: 0.5});
  const [rotate, setRotate] = useState(0);
  const [editor, setEditor] = useState(null);

  const userId = auth.user.id;

  const extensions = ["jpg", "jpeg", "png"];

  const loadData = () => {
    setLoading(true);
    Service.avatar({id: userId})
      .then(res => {
        setLoading(false);
        const data = res.data;
        if (res.result === RESULT.SUCCESS) {
          setUrl(`${apis.assetsBaseUrl}${data.url}`);
          setOriginUrl(`${apis.assetsBaseUrl}${data.originUrl}`);
          setScale(data.scale);
          setBorderRadius(data.borderRadius);
          setPosition(data.position);
          setRotate(data.rotate);
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

  const handleSubmit = e => {
    e.preventDefault();

    const base64 = editor.getImageScaledToCanvas().toDataURL();

    const params = new FormData();
    params.append("id", userId);
    !!file && params.append("file", file);
    params.append("base64", base64);
    params.append("scale", scale);
    params.append("borderRadius", borderRadius);
    params.append("xPosition", position.x);
    params.append("yPosition", position.y);
    params.append("rotate", rotate);

    setLoading(true);
    Service.saveAvatar(params)
      .then(res => {
        setLoading(false);
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .catch(err => {
        setLoading(false);
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const payload = () => (
    <MDBCard className="mt-3">
      <MDBCardBody>
        <h4 className="h4-responsive text-left grey-text">{t("COMMON.FIELDS.AVATAR.AVATAR")}</h4>
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="6" className="text-center">
              <div className="my-avatar-upload mx-auto">
                {!!originUrl.length && <MDBFileupload
                  defaultFileSrc={originUrl}
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
                  errorFileExtension={t("COMMON.FILE_UPLOAD.ERROR_FILEEXTENSION", {extensions: extensions.join(", ")})}/>}
              </div>
            </MDBCol>
            <MDBCol md="6" className="text-center mt-4 mt-md-0">
              {!!originUrl.length && <ReactAvatarEditor
                ref={setEditor}
                scale={scale}
                position={position}
                onPositionChange={setPosition}
                rotate={rotate}
                borderRadius={width / 100 * borderRadius}
                image={!!file ? file : originUrl}
                className="editor-canvas"
                crossOrigin="anonymous"
              />}
            </MDBCol>
          </MDBRow>
          <div className="my-avatar-sliders-container mx-auto mt-md-3 text-left">
            <div>
              <label htmlFor="scale">{t("COMMON.FIELDS.AVATAR.SCALE")}</label>
              <input type="range" className="custom-range" min={0.9} max={2} step={0.01} value={scale}
                     onChange={e => setScale(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="yPosition">{t("COMMON.FIELDS.AVATAR.BORDER_RADIUS")}</label>
              <input type="range" className="custom-range" min={0} max={50} step={1} value={borderRadius}
                     onChange={e => setBorderRadius(e.target.value)}/>
            </div>
          </div>

          <div className="text-center mt-4 mb-3">
            <MDBBtn type="submit" color="primary" size="sm" rounded className="z-depth-1a"
                    disabled={!!loading}>
              {!!loading && <div className="spinner-grow spinner-grow-sm" role="status"/>}
              {!loading && t("COMMON.BUTTON.SAVE")}
            </MDBBtn>
          </div>
        </form>
      </MDBCardBody>
    </MDBCard>
  );

  return payload();
}
