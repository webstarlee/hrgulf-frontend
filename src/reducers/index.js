import {combineReducers} from "redux";
import auth from "reducers/auth.reducer";
import myJobs from "reducers/my-jobs.reducer";
import minifiedProfile from "reducers/minified-profile.reducer";
import {withReduxStateSync} from "redux-state-sync";

const rootReducer = combineReducers({
  auth,
  myJobs,
  minifiedProfile,
});

export default withReduxStateSync(rootReducer);

