import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { courseSelector } from "../selectors";
import { State } from "../utils/store";
import { loadCourse, Dispatch, CourseMetadata } from "../actions";

const Course = ({
  course,
  loadCourseAction,
}: {
  course: CourseMetadata;
  loadCourseAction: (docId: string) => void;
}) => {
  const { sheetId } = useParams();

  useEffect(() => {
    loadCourseAction(sheetId);
  }, [sheetId]);

  return (
    <>
      <div>{sheetId}</div>
      <code>{JSON.stringify(course, null, 2)}</code>
    </>
  );
};

export default connect(
  (s: State) => ({ course: courseSelector(s) }),
  (dispatch: Dispatch) => ({
    loadCourseAction: (docId: string) => dispatch(loadCourse(docId)),
  }),
)(Course);
