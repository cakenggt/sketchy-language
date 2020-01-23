import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { CourseListing } from "../actions";
import { coursesSelector } from "../selectors";
import { State } from "../utils/store";

const CourseList = ({ courses }: { courses: CourseListing[] }) => (
  <>
    {courses
      ? courses.map(({ coursename, sheetid }, i) => (
          <li key={i}>
            <Link to={`/course/${sheetid}`}>{coursename}</Link>
          </li>
        ))
      : null}
  </>
);

export default connect((state: State) => ({
  courses: coursesSelector(state),
  state,
}))(CourseList);
