import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import flowReducer from "./reducers/index";

const store = createStore(flowReducer, applyMiddleware(logger, thunk));

export default store;
