import { createStore, applyMiddleware } from "redux";
import logger from 'redux-logger';
import flowReducer from "./reducers/index";

const store = createStore(flowReducer, applyMiddleware(logger));

export default store;
