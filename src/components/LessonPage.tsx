import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import _ from "underscore";

import { courseSelector, lessonSelector } from "../selectors";
import { State } from "../utils/store";
import { loadCourse, Dispatch, Course, Lesson, setProgress } from "../actions";
import { Challenge } from "../utils/generators";
import LessonPlayer from "./player/LessonPlayer";

export default connect(
  (s: State) => ({
    course: courseSelector(s),
    lessonSelectorCurry: lessonSelector(s),
  }),
  (dispatch: Dispatch) => ({
    loadCourseAction: (docId: string) => dispatch(loadCourse(docId)),
    setProgress: setProgress,
  }),
)(
  ({
    course,
    lessonSelectorCurry,
    loadCourseAction,
    setProgress,
  }: {
    course: Course;
    lessonSelectorCurry: (skillId: number, lessonId: number) => Lesson;
    loadCourseAction: (docId: string) => void;
    setProgress: (courseId: string, skillId: string, lesson: number) => void;
  }) => {
    const { sheetId, skillId, lessonId } = useParams();
    const lesson = lessonSelectorCurry(parseInt(skillId), parseInt(lessonId));

    useEffect(() => {
      if (_.isEmpty(course)) {
        loadCourseAction(sheetId);
      }
    }, [sheetId]);

    const [challenges, setChallenges] = useState([] as Challenge[]);
    const history = useHistory();

    if (_.isEmpty(course)) {
      return null;
    }

    if (!challenges.length) {
      setChallenges(lesson.challenges);
      return null;
    }

    const onFinish = () => {
      setProgress(sheetId, skillId, parseInt(lessonId));
      history.push(`/course/${sheetId}`);
    };

    return <LessonPlayer challenges={challenges} onFinish={onFinish} />;
  },
);
