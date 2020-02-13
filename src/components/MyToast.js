import React, { Component } from "react";
import { toast, cssTransition } from "react-toastify";

import {EFFECT} from "core/globals";

export const Zoom = cssTransition({
  enter: "zoomIn",
  exit: "zoomOut",
  // default to 750ms, can be omitted
  duration: EFFECT.TRANSITION_TIME,
});

export const Fade = cssTransition({
  enter: "fadeIn",
  exit: "fadeOut",
  // default to 750ms, can be omitted
  duration: EFFECT.TRANSITION_TIME,
});

export default toast;
