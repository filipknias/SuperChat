import React from "react";
import { Route, Redirect, RouteComponentProps } from "react-router-dom";

interface Props {
  component: React.FC<RouteComponentProps>;
  auth: boolean;
  path: string;
  exact?: boolean;
}

const PublicRoute: React.FC<Props> = ({
  component: Component,
  auth,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      auth === true ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);

export default PublicRoute;
