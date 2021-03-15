// Types
import { SET_SELECTED_USER, SET_SOCKET, SET_MESSAGES } from "../types";

interface Action {
  type: string;
  payload: any;
}

export interface SenderUser {
  user_id: number;
  email: string;
  full_name: string;
  photo_url: string | null;
}

export interface MessageFromDB extends SenderUser {
  message_id: number;
  message: string;
  sender_id: number;
  recipient_id: number;
  created_at: Date;
}

export interface DataState {
  socket: SocketIOClient.Socket | null;
  selectedUser: SenderUser | null;
  messages: MessageFromDB[];
}

const initialState = {
  socket: null,
  selectedUser: null,
  messages: [],
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
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    default:
      return state;
  }
};
