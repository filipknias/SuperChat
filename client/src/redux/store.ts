import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { UserState } from "./reducers/userReducer";
import { DataState } from "./reducers/dataReducer";

import userReducer from "./reducers/userReducer";
import dataReducer from "./reducers/dataReducer";

const initialState = {};
const middleware = [thunk];

export interface RootState {
  user: UserState;
  data: DataState;
}

const reducers = combineReducers<RootState>({
  user: userReducer,
  data: dataReducer,
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
