import React from "react";
// React router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Pages
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
// Chakra UI
import { Box } from "@chakra-ui/react";
// Redux
import { Provider } from "react-redux";
import store from "../redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Box bg="gray.100" maxW="100vw" maxH="100vh">
        <Router>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </Router>
      </Box>
    </Provider>
  );
};

export default App;
