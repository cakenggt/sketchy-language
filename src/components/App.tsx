import * as React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import CourseList from "./CourseList";
import Course from "./Course";
import LessonPlayer from "./player/LessonPlayer";

const App = () => (
  <div>
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <CourseList />
        </Route>
        <Route exact path="/course/:sheetId">
          <Course />
        </Route>
        <Route exact path="/course/:sheetId/practice/:skillId/:lessonId">
          <LessonPlayer />
        </Route>
      </Switch>
    </HashRouter>
  </div>
);

export default App;
