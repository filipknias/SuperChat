import React, { useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
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

  return (
    <Box bg="gray.100" maxW="100vw" maxH="100vh">
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
