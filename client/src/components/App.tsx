import React from "react";
// React router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Pages
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
// Chakra UI
import { Box } from "@chakra-ui/react";

const App = () => {
  return (
    <Box bg="gray.100" w="100vw" h="100vh">
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </Box>
  );
};

export default App;
