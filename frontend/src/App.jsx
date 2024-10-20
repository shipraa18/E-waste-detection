import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PublicPage from './components/PublicPage';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={PublicPage} />
        <Route path="/login">
          {authToken ? <Redirect to="/admin" /> : <Login setAuthToken={setAuthToken} />}
        </Route>
        <Route path="/admin">
          {authToken ? <AdminPanel authToken={authToken} /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
