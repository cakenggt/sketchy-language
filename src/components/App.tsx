import * as React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import CourseList from "./CourseList";
import Course from "./Course";
import LessonPlayer from "./player/LessonPlayer";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const App = () => (
  <Container>
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
  </Container>
);

export default App;
