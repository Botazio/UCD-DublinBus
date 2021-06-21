import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import NavBar from './components/navbar/NavBar';
import NotFound from './components/notfound/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <NavBar />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
