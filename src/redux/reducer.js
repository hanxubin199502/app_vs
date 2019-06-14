/**
 * Created by haita on 2018/1/8 0008.
 */
import { combineReducers } from 'redux';
import { count } from "../containers/container/container.redux"
const rootReducer = combineReducers({
    count
});
export default rootReducer