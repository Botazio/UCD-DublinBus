import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./providers/AuthContext";
import BusPage from "./pages/BusPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import PrivateRoute from "./helpers/PrivateRoute";
import UserPage from "./pages/UserPage";
import NotFound from "./components/notfound/NotFound";
import NoUserRoute from "./helpers/NoUserRoute";
import { StopsProvider } from "./providers/StopsContext";
import CustomThemeProvider from "./providers/CustomThemeProvider";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CustomThemeProvider>
          <Switch>
            <Route exact path="/">
              <StopsProvider>
                <BusPage />
              </StopsProvider>
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
        </CustomThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
