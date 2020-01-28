import * as React from "react";
import { connect } from "react-redux";

import { CourseListing } from "../actions";
import { coursesSelector } from "../selectors";
import { State } from "../utils/store";
import Link from "./Link";

const CourseList = ({ courses }: { courses: CourseListing[] }) => (
  <>
    {courses
      ? courses.map(({ coursename, sheetid }, i) => (
          <li key={i}>
            <Link href={`/course/${sheetid}`}>{coursename}</Link>
          </li>
        ))
      : null}
  </>
);

export default connect((state: State) => ({
  courses: coursesSelector(state),
  state,
}))(CourseList);
