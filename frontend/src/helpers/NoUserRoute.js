import { useAuth } from "../providers/AuthContext";
import { Route, Redirect } from "react-router";

// A wrapper for <Route> that redirects to the login
// screen if you're are authenticated. Avoids the users to be able to login twice
export default function NoUserRoute({ children, ...rest }) {
  let auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !auth.currentUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
