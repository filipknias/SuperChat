import {
  SET_SELECTED_USER,
  SET_SOCKET,
  START_DATA_LOADING,
  STOP_DATA_LOADING,
} from "../types";
import { UserData } from "../reducers/userReducer";

interface Action {
  type: string;
  payload: any;
}

export interface DataState {
  socket: SocketIOClient.Socket | null;
  selectedUser: UserData | null;
  loading: boolean;
}

const initialState = {
  socket: null,
  selectedUser: null,
  loading: false,
};

export default (state: DataState = initialState, action: Action) => {
  switch (action.type) {
    case SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    case START_DATA_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_DATA_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
