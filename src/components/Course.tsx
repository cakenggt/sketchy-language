import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { WiredCard } from "react-wired-element";
import styled from "styled-components";
import _ from "underscore";

import {
  courseSelector,
  coursesSelector,
  progressSelector,
} from "../selectors";
import { State } from "../utils/store";
import {
  loadCourse,
  Dispatch,
  Course,
  CourseListing,
  Progress,
} from "../actions";
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
  progress,
}: {
  course: Course;
  courses: CourseListing[];
  loadCourseAction: (docId: string) => void;
  progress: Progress;
}) => {
  const { sheetId } = useParams();
  const courseName = courses.find(m => m.sheetid === sheetId)?.coursename;

  useEffect(() => {
    loadCourseAction(sheetId);
  }, [sheetId]);

  if (_.isEmpty(course)) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <h1>{courseName}</h1>
      <Container>
        {course.skills.map((skill, i) => {
          const skillId = i + 1;
          const nextLessonFromProgress =
            (progress[sheetId]?.[skillId] ?? 0) + 1;
          const totalLessons = skill.lessons.length;
          // Check previous skill to see if it is finished
          const prevSkill = course.skills[i - 1];
          const isAvailable =
            !prevSkill ||
            progress[sheetId]?.[skillId - 1] >= prevSkill.lessons.length;
          const isFinished = nextLessonFromProgress > totalLessons;
          const label = isAvailable
            ? isFinished
              ? "Review"
              : `Practice ${nextLessonFromProgress - 1}/${totalLessons}`
            : "Blocked";
          return (
            <Card key={i}>
              <WiredCard style={{ flex: 1 }}>
                <div>{skill.name}</div>
                <Link
                  disabled={isAvailable ? null : true}
                  href={`/course/${sheetId}/${
                    isFinished
                      ? `review/${skillId}`
                      : `practice/${skillId}/${nextLessonFromProgress}`
                  }`}
                >
                  {label}
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
  (s: State) => ({
    course: courseSelector(s),
    courses: coursesSelector(s),
    progress: progressSelector(),
  }),
  (dispatch: Dispatch) => ({
    loadCourseAction: (docId: string) => dispatch(loadCourse(docId)),
  }),
)(Course);
