import {combineReducers} from "redux";
import auth from "reducers/auth.reducer";
import {withReduxStateSync} from "redux-state-sync";

const rootReducer = combineReducers({
  auth,
});

export default withReduxStateSync(rootReducer);

