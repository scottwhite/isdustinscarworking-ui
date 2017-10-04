import { combineReducers } from 'redux';
import status from '../carstatus/reducers';

const rootReducer = combineReducers({
  status
})

export default rootReducer
