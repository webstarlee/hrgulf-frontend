import React from "react";
import {Redirect, Route, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import routes from "core/routes";
import {ACCOUNT} from "../core/globals";

export default ({component, type, ...props}) => {
  const {auth} = useSelector(state => state);
  const history = useHistory();

  const pathname = history.location.pathname;
  const signInPath = type === ACCOUNT.TYPE.HIRE ? routes.hire.auth.signIn : routes.work.auth.signIn;

  return (
    !auth.signedIn && pathname !== signInPath ? <Redirect to={`${signInPath}?redirect=${encodeURI(history.location.pathname)}`}/> : <Route component={component} {...props}/>
  );
}