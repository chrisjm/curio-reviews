import React from 'react';
import { Pane, Heading, majorScale } from 'evergreen-ui';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Pane display="flex" flexDirection="column">
      <Router>
        <Pane
          padding={majorScale(2)}
          background="linear-gradient(30deg, #f90 55%, #FFC300)"
          boxShadow="1px 2px 4px rgba(0, 0, 0, .3)"
          marginBottom={majorScale(3)}
          textAlign="center"
        >
          <Heading size={700} color="white">
            CURIO Reviews
          </Heading>
        </Pane>
        <Switch>
          <Route path="/admin">
            <AdminPage />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </Pane>
  );
}

export default App;
