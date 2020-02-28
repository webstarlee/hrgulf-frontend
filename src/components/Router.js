import React, {lazy} from "react";
import {Switch, Route, useHistory, BrowserRouter} from "react-router-dom";
import {TransitionGroup, CSSTransition} from "react-transition-group";

import routes from "core/routes";
import SignedInRoute from "components/SignedInRoute";
import SignedOutRoute from "components/SignedOutRoute";
import Error404Page from "pages/common/Error404Page";

const HirePage = lazy(() => import("pages/hire/RootPage"));
const WorkPage = lazy(() => import("pages/work/RootPage"));

export default () => {
  // let viewElement = useViewElement()
  const history = useHistory();
  const location = history.location;

  return (
    // <TransitionGroup>
    //   <CSSTransition
    //     key={location.key}
    //     timeout={{enter: 800, exit: 800}}
    //     classNames={"fade-transition"}
    //   >
        <Switch>
          {/*<SignedOutRoute path={routes.auth.root} component={AuthPage}/>*/}
          {/*<SignedInRoute path={routes.account.root} component={AccountPage}/>*/}
          <Route path={routes.root} exact component={WorkPage}/>
          <Route path={routes.hire.root} component={HirePage}/>
          <Route path={routes.work.root} component={WorkPage}/>

          {/*<Route path={routes.admin} exact render={() => (window.location.href = `${routes.admin}/`)}/>*/}
          <Route component={Error404Page}/>
        </Switch>
      // </CSSTransition>
    // </TransitionGroup>
  );
};
