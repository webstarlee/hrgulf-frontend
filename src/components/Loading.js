import React from "react";
import {useTranslation} from "react-i18next";

import Loader from "./partial/Loader";

import "./Error404.scss";

export default ({className, style}) => {

  const {t} = useTranslation();

  return (
    <div className={!!className ? className : "loading-page"} style={style}>
      <Loader />
    </div>
  );
}
