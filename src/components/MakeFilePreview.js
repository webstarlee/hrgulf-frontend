import React from "react";
import {useTranslation} from "react-i18next";

export default ({name, ext}) => {
  const {t} = useTranslation();

  const payload = () => (
    <div data-test="component-preview-wrapper" className="file-upload-preview">
        <span className="file-upload-render">
          <i data-test="component-preview-icon" className="fa fa-file"></i>
          <span data-test="component-preview-ext" className="file-upload-extension">{ext}</span>
        </span>
      <div className="file-upload-infos">
        <div className="file-upload-infos-inner">
          <p className="file-upload-filename">
            <span data-test="component-preview-name" className="file-upload-filename-inner">{name}</span>
          </p>
          <p data-test="component-preview-msg" className="file-upload-infos-message">{t("COMMON.FILE_UPLOAD.REPLACE")}</p>
        </div>
      </div>
    </div>
  );

  return payload();
};
