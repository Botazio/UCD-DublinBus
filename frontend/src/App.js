import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./providers/AuthContext";
import "./App.css";
import BusPage from "./pages/BusPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import PrivateRoute from "./helpers/PrivateRoute";
import UserPage from "./pages/UserPage";
import NotFound from "./components/notfound/NotFound";
import NoUserRoute from "./helpers/NoUserRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/">
            <BusPage />
          </Route>
          <NoUserRoute exact path="/login">
            <AuthenticationPage />
          </NoUserRoute>
          <PrivateRoute exact path="/user">
            <UserPage />
          </PrivateRoute>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
