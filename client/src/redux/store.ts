import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { UserState } from "./reducers/userReducer";

import userReducer from "./reducers/userReducer";

const initialState = {};
const middleware = [thunk];

export interface RootState {
  user: UserState;
}

const reducers = combineReducers<RootState>({
  user: userReducer,
});

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(reducers, initialState, enhancer);

export default store;
