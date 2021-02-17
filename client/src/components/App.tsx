import React, { useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import io from "socket.io-client";
// React router
import { BrowserRouter as Router, Switch, useHistory } from "react-router-dom";
// Components
import PrivateRoute from "./Routes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoute";
// Pages
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
// Chakra UI
import { Box } from "@chakra-ui/react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, loginUserById } from "../redux/actions/userActions";
import { setSocket } from "../redux/actions/dataActions";
// Types
import { RootState } from "../redux/store";
import { UserState } from "../redux/reducers/userReducer";

const App: React.FC = () => {
  // Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const userState = useSelector<RootState, UserState>((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("superchat-auth-token");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        // Expired token
        dispatch(logoutUser());
        history.push("/login");
      } else {
        // Valid token
        dispatch(loginUserById(decodedToken.id));
        axios.defaults.headers.common["auth-token"] = token;
      }
    }
  }, []);

  useEffect(() => {
    if (userState.auth) {
      const newSocket = io("localhost:3000", {
        query: { id: userState.data?.user.user_id.toString() },
        port: process.env.PORT || "3000",
      });
      dispatch(setSocket(newSocket));
    } else {
      dispatch(setSocket(null));
    }
  }, [userState.auth]);

  return (
    <Box bg="gray.200" w="100vw" h="100vh">
      <Router>
        <Switch>
          <PrivateRoute
            exact
            path="/"
            auth={userState.auth}
            component={Dashboard}
          />
          <PublicRoute path="/login" auth={userState.auth} component={Login} />
          <PublicRoute
            path="/register"
            auth={userState.auth}
            component={Register}
          />
        </Switch>
      </Router>
    </Box>
  );
};

export default App;
