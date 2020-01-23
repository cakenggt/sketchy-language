import * as React from "react";
import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import CourseList from "./CourseList";
import Course from "./Course";

const history = createBrowserHistory();

const App = () => (
  <div>
    <Router history={history}>
      <Switch>
        <Route exact path="/">
          <CourseList />
        </Route>
        <Route path="/course/:sheetId">
          <Course />
        </Route>
      </Switch>
    </Router>
  </div>
);

export default App;
