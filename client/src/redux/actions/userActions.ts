import axios from "axios";
// Types
import {
  SET_USER,
  LOGOUT_USER,
  SET_USER_ERROR,
  CLEAR_ERROR,
  START_USER_LOADING,
  STOP_USER_LOADING,
} from "../types";
import { Dispatch } from "redux";

export const loginUser = (
  email: string,
  password: string,
  rememberMe: boolean,
  history: any
) => async (dispatch: Dispatch) => {
  dispatch({ type: START_USER_LOADING });
  try {
    // Get user data
    const user = await axios.post("/api/users/login", {
      email,
      password,
    });
    // Clear login errors
    dispatch({ type: CLEAR_ERROR });
    // Set user state
    dispatch({
      type: SET_USER,
      payload: user.data,
    });
    // Save token to localstorage if remember me selected
    if (rememberMe) {
      localStorage.setItem("superchat-auth-token", user.data.token);
    } else {
      localStorage.removeItem("superchat-auth-token");
    }
    // Redirect to dashboard
    history.push("/");
  } catch (err) {
    dispatch({
      type: SET_USER_ERROR,
      payload: err.response.data,
    });
  }
  dispatch({ type: STOP_USER_LOADING });
};

export const registerUser = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  history: any
) => async (dispatch: Dispatch) => {
  dispatch({ type: START_USER_LOADING });
  try {
    const createdUser = await axios.post("/api/users/register", {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    // Clear errors
    dispatch({ type: CLEAR_ERROR });
    // Set user state
    dispatch({ type: SET_USER, payload: createdUser.data });
    // Clear storage auth token
    localStorage.removeItem("superchat-auth-token");
    // Redirect to dashboard
    history.push("/");
  } catch (err) {
    dispatch({
      type: SET_USER_ERROR,
      payload: err.response.data,
    });
  }
  dispatch({ type: STOP_USER_LOADING });
};

export const logoutUser = () => (dispatch: Dispatch) => {
  localStorage.removeItem("superchat-auth-token");
  dispatch({ type: LOGOUT_USER });
};

export const loginUserById = (id: string) => async (dispatch: Dispatch) => {
  try {
    const user = await axios.get(`/api/users/token/${id}`);
    dispatch({ type: SET_USER, payload: user.data });
  } catch (err) {
    dispatch({
      type: SET_USER_ERROR,
      payload: err.response.data,
    });
  }
};
