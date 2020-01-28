import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import _ from "underscore";

import { courseSelector } from "../selectors";
import { State } from "../utils/store";
import { loadCourse, Dispatch, Course } from "../actions";
import Link from "./Link";

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
    <>
      {course.skills.map((skill, i) => {
        return (
          <div key={i}>
            {skill.name}{" "}
            {skill.lessons.map((_, j) => (
              <Link
                key={j}
                href={`/course/${sheetId}/practice/${i + 1}/${j + 1}`}
              >
                {j + 1}
              </Link>
            ))}
          </div>
        );
      })}
      <pre>{JSON.stringify(course, null, 2)}</pre>
    </>
  );
};

export default connect(
  (s: State) => ({ course: courseSelector(s) }),
  (dispatch: Dispatch) => ({
    loadCourseAction: (docId: string) => dispatch(loadCourse(docId)),
  }),
)(Course);
