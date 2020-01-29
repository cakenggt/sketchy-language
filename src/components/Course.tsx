import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { WiredCard } from "react-wired-element";
import styled from "styled-components";
import _ from "underscore";

import { courseSelector, coursesSelector } from "../selectors";
import { State } from "../utils/store";
import { loadCourse, Dispatch, Course, CourseListing } from "../actions";
import Link from "./Link";

const Container = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(5, 1fr);
`;

const Card = styled.div`
  display: flex;
  justify-content: stretch;
  grid-column: auto / auto;
  grid-row: auto / auto;
`;

const Course = ({
  course,
  courses,
  loadCourseAction,
}: {
  course: Course;
  courses: CourseListing[];
  loadCourseAction: (docId: string) => void;
}) => {
  const { sheetId } = useParams();
  const courseName = courses.find(m => m.sheetid === sheetId)?.coursename;

  useEffect(() => {
    loadCourseAction(sheetId);
  }, [sheetId]);

  if (_.isEmpty(course)) {
    return null;
  }

  return (
    <>
      <h1>{courseName}</h1>
      <Container>
        {course.skills.map((skill, i) => {
          return (
            <Card key={i}>
              <WiredCard style={{ flex: 1 }}>
                <div>{skill.name}</div>
                <Link href={`/course/${sheetId}/practice/${i + 1}/1`}>
                  Practice
                </Link>
              </WiredCard>
            </Card>
          );
        })}
      </Container>
    </>
  );
};

export default connect(
  (s: State) => ({ course: courseSelector(s), courses: coursesSelector(s) }),
  (dispatch: Dispatch) => ({
    loadCourseAction: (docId: string) => dispatch(loadCourse(docId)),
  }),
)(Course);
