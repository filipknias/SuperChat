import React from "react";
// React router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Pages
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
// Chakra UI
import { Box } from "@chakra-ui/react";

const App: React.FC = () => {
  return (
    <Box bg="gray.100" w="100vw" h="100vh">
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </Router>
    </Box>
  );
};

export default App;
