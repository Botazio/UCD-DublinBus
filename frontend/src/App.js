import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./providers/AuthContext";
import BusPage from "./pages/BusPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import PrivateRoute from "./helpers/PrivateRoute";
import UserPage from "./pages/UserPage";
import NotFound from "./reusable-components/notfound/NotFound";
import NoUserRoute from "./helpers/NoUserRoute";
import { StopsProvider } from "./providers/StopsContext";
import CustomThemeProvider from "./providers/CustomThemeProvider";
import { LinesProvider } from "./providers/LinesContext";
import { GeolocationProvider } from "./providers/GeolocationContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CustomThemeProvider>
          <StopsProvider>
            <LinesProvider>
              <GeolocationProvider>
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
              </GeolocationProvider>
            </LinesProvider>
          </StopsProvider>
        </CustomThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
