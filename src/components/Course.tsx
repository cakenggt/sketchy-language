import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { WiredCard } from "react-wired-element";
import styled from "styled-components";
import _ from "underscore";

import { courseSelector } from "../selectors";
import { State } from "../utils/store";
import { loadCourse, Dispatch, Course } from "../actions";
import Link from "./Link";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div`
  flex: 1;
`;

const Course = ({
  course,
  loadCourseAction,
}: {
  course: Course;
  loadCourseAction: (docId: string) => void;
}) => {
  const { sheetId } = useParams();

  useEffect(() => {
    loadCourseAction(sheetId);
  }, [sheetId]);

  if (_.isEmpty(course)) {
    return null;
  }

  return (
    <Container>
      {course.skills.map((skill, i) => {
        return (
          <Card key={i}>
            <WiredCard>
              <div>{skill.name}</div>
              <Link href={`/course/${sheetId}/practice/${i + 1}/1`}>
                Practice
              </Link>
            </WiredCard>
          </Card>
        );
      })}
    </Container>
  );
};

export default connect(
  (s: State) => ({ course: courseSelector(s) }),
  (dispatch: Dispatch) => ({
    loadCourseAction: (docId: string) => dispatch(loadCourse(docId)),
  }),
)(Course);
