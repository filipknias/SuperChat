import React from "react";
// React router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Pages
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/register" component={Account} />
      </Switch>
    </Router>
  );
};

export default App;
