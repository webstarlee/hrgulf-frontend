import {combineReducers} from "redux";
import auth from "reducers/auth.reducer";
import myJobs from "reducers/my-jobs.reducer";
import {withReduxStateSync} from "redux-state-sync";

const rootReducer = combineReducers({
  auth,
  myJobs,
});

export default withReduxStateSync(rootReducer);

