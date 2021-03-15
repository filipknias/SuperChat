// Types
import { Dispatch } from "redux";
import { MessageFromDB, SenderUser } from "../reducers/dataReducer";
import { SET_SELECTED_USER, SET_SOCKET, SET_MESSAGES } from "../types";
// Others
import axios from "axios";

export const setSelectedUser = (user: SenderUser | null) => (
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

export const setMessages = (messages: MessageFromDB[]) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: SET_MESSAGES,
    payload: messages,
  });
};

export const getMessages = (userId: number) => async (dispatch: Dispatch) => {
  const usersMessages = await axios.get(`/api/messages/${userId}`);
  dispatch({
    type: SET_MESSAGES,
    payload: usersMessages.data,
  });
};
