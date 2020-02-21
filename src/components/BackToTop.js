import React from "react";
import useWindowScrollPosition from "@rehooks/window-scroll-position";
import {animateScroll as scroll} from "react-scroll";
import {CSSTransition} from "react-transition-group";

import {EFFECT} from "core/globals";

import "./BackToTop.scss";

export default ({thresholdY, duration, transitionTime, ...props}) => {
  const handleBackToTop = e => {
    scroll.scrollToTop({
      duration: duration || EFFECT.TRANSITION_TIME,
    });
  };

  const options = {
    throttle: 100,
  };
  const position = useWindowScrollPosition(options);
  const flag = position.y > (thresholdY || 200);

  return (
    <CSSTransition in={flag} classNames="fade-transition" timeout={transitionTime || EFFECT.TRANSITION_TIME} appear {...props}>
      <div>
        {!!flag && <div className="fixed-action-btn my-fixed-action-btn smooth-scroll back-to-top-container">
          <a id="back-to-top" className="btn-floating btn-large mdb-color" onClick={handleBackToTop}>
            <i className="fa fa-arrow-up" />
          </a>
        </div>}
      </div>
    </CSSTransition>
  )
}