import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import _ from "underscore";

import { courseSelector, skillSelector } from "../selectors";
import { State } from "../utils/store";
import { loadCourse, Dispatch, Course, Lesson, Skill } from "../actions";
import { Challenge } from "../utils/generators";
import LessonPlayer from "./player/LessonPlayer";

export default connect(
  (s: State) => ({
    course: courseSelector(s),
    skillSelectorCurry: skillSelector(s),
  }),
  (dispatch: Dispatch) => ({
    loadCourseAction: (docId: string) => dispatch(loadCourse(docId)),
  }),
)(
  ({
    course,
    loadCourseAction,
    skillSelectorCurry,
  }: {
    course: Course;
    loadCourseAction: (docId: string) => void;
    skillSelectorCurry: (skillId: number) => Skill;
  }) => {
    const { sheetId, skillId } = useParams();

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

    const skill = skillSelectorCurry(parseInt(skillId));

    if (!challenges.length) {
      setChallenges(
        _.chunk(
          _.shuffle(_.flatten(skill.lessons.map(lesson => lesson.challenges))),
          10,
        )[0] as Challenge[],
      );
      return null;
    }

    const onFinish = () => {
      history.push(`/course/${sheetId}`);
    };

    return <LessonPlayer challenges={challenges} onFinish={onFinish} />;
  },
);
