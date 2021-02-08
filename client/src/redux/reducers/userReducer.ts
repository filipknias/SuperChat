import {
  SET_USER,
  LOGOUT_USER,
  SET_ERROR,
  CLEAR_ERROR,
  START_USER_LOADING,
  STOP_USER_LOADING,
} from "../types";

interface Action {
  type: string;
  payload: any;
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  password: string;
  createdAt: Date;
  photoUrl: string | null;
}

interface Data {
  token: string;
  user: UserData;
}

interface Errors {
  general?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  photoUrl?: string;
}

export interface UserState {
  auth: boolean;
  data: Data | null;
  error: Errors | null;
  loading: boolean;
}

const initialState = {
  auth: false,
  data: null,
  error: null,
  loading: false,
};

export default (state: UserState = initialState, action: Action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        auth: true,
        data: action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        auth: false,
        data: null,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case START_USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_USER_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
