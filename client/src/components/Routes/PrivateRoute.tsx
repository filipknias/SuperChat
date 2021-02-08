import React from "react";
import { Route, Redirect, RouteComponentProps } from "react-router-dom";

interface Props {
  component: React.FC<RouteComponentProps>;
  auth: boolean;
  path: string;
  exact?: boolean;
}

const PrivateRoute: React.FC<Props> = ({
  component: Component,
  auth,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      auth === true ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default PrivateRoute;
