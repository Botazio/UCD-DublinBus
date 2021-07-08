import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import BusPage from './pages/BusPage';
import AuthenticationPage from './pages/AuthenticationPage';
import PrivateRoute from './helpers/PrivateRoute';
import UserPage from './pages/UserPage';
import NotFound from './components/notfound/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <BusPage />
        </Route>
        <Route exact path="/login">
          <AuthenticationPage />
        </Route>
        <PrivateRoute exact path="/user">
          <UserPage />
        </PrivateRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
