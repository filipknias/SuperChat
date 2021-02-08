import React from "react";
// React router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
import { useSelector } from "react-redux";
// Types
import { RootState } from "../redux/store";
import { UserState } from "../redux/reducers/userReducer";

const App: React.FC = () => {
  const userState = useSelector<RootState, UserState>((state) => state.user);

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
