import { combineReducers } from 'redux';
import templateReducer from './template.js';
import applicationReducer from './application.js';

const flowReducer = combineReducers({
  template: templateReducer,
  application: applicationReducer,
});

export default flowReducer;
