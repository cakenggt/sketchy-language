import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import _ from "underscore";

import { courseSelector, lessonSelector } from "../../selectors";
import { State } from "../../utils/store";
import { loadCourse, Dispatch, Course, Lesson } from "../../actions";

const LessonPlayer = ({
  course,
  lessonSelectorCurry,
  loadCourseAction,
}: {
  course: Course;
  lessonSelectorCurry: (skillId: number, lessonId: number) => Lesson;
  loadCourseAction: (docId: string) => void;
}) => {
  const { sheetId, skillId, lessonId } = useParams();
  const lesson = lessonSelectorCurry(parseInt(skillId), parseInt(lessonId));

  useEffect(() => {
    if (_.isEmpty(course)) {
      loadCourseAction(sheetId);
    }
  }, [sheetId]);

  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  if (_.isEmpty(course)) {
    return null;
  }

  if (!challenges.length) {
    setChallenges(lesson.challenges);
  }

  const challenge = challenges?.[currentChallenge];

  return (
    <>
      <pre>{JSON.stringify(challenge, null, 2)}</pre>
      <button onClick={() => setCurrentChallenge(currentChallenge + 1)}>
        next
      </button>
    </>
  );
};

export default connect(
  (s: State) => ({
    course: courseSelector(s),
    lessonSelectorCurry: lessonSelector(s),
  }),
  (dispatch: Dispatch) => ({
    loadCourseAction: (docId: string) => dispatch(loadCourse(docId)),
  }),
)(LessonPlayer);
