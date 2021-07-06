import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import BusPage from './pages/BusPage';
import Authentication from './components/authentication/Authentication';
import NotFound from './components/notfound/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <BusPage />
        </Route>
        <Route exact path="/login">
          <Authentication />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
