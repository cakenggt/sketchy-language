import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { CourseListing } from "../actions";
import { coursesSelector } from "../selectors";
import { State } from "../utils/store";
import Link from "./Link";

const CoursesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 30px;
`;

const CourseListing = styled.div`
  flex: 1;
`;

const CourseList = ({ courses }: { courses: CourseListing[] }) => (
  <>
    <h1>Sketchy Language</h1>
    <h2>Courses</h2>
    <CoursesContainer>
      {courses
        ? courses.map(({ coursename, sheetid }, i) => (
            <CourseListing key={i}>
              <Link href={`/course/${sheetid}`}>{coursename}</Link>
            </CourseListing>
          ))
        : "Loading..."}
    </CoursesContainer>
    <Link href="/about">About</Link>
  </>
);

export default connect((state: State) => ({
  courses: coursesSelector(state),
  state,
}))(CourseList);
