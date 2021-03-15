import {
  SET_USER,
  LOGOUT_USER,
  SET_USER_ERROR,
  CLEAR_ERROR,
  START_USER_LOADING,
  STOP_USER_LOADING,
} from "../types";

interface Action {
  type: string;
  payload: any;
}

export interface UserData {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  password: string;
  created_at: Date;
  photo_url: string | null;
}

export interface UserState {
  auth: boolean;
  data: Data | null;
  error: Errors | null;
  loading: boolean;
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
    case SET_USER_ERROR:
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
