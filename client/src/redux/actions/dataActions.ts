// Types
import { Dispatch } from "redux";
import {
  SET_SELECTED_USER,
  SET_SOCKET,
  START_DATA_LOADING,
  STOP_DATA_LOADING,
} from "../types";
import { UserData } from "../reducers/userReducer";

export const setSelectedUser = (user: UserData | null) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: SET_SELECTED_USER,
    payload: user,
  });
};

export const setSocket = (socket: SocketIOClient.Socket | null) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: SET_SOCKET,
    payload: socket,
  });
};
