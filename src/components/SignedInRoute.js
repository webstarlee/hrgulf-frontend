import React from "react";
import {Redirect, Route, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import routes from "core/routes";

export default ({component, ...props}) => {
  const {auth} = useSelector(state => state);
  const history = useHistory();

  const pathname = history.location.pathname;

  return (
    !auth.signedIn && pathname !== routes.auth.signIn ? <Redirect to={`${routes.auth.signIn}?redirect=${encodeURI(history.location.pathname)}`}/> : <Route component={component} {...props}/>
  );
}