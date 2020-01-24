import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import _ from "underscore";

import { courseSelector, lessonSelector } from "../../selectors";
import { State } from "../../utils/store";
import { loadCourse, Dispatch, Course, Lesson } from "../../actions";
import { Challenge } from "../../utils/generators";
import JudgeChallenge from "./JudgeChallenge";
import TranslateChallenge from "./TranslateChallenge";

type NextFunction = () => boolean;
export type SetNextFunction = (n: NextFunction) => void;

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

  const [challenges, setChallenges] = useState([] as Challenge[]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [nextFunction, setNextFunction] = useState<() => boolean>(null);
  const history = useHistory();

  if (_.isEmpty(course)) {
    return null;
  }

  if (!challenges.length) {
    setChallenges(lesson.challenges);
  }

  const challenge = challenges[currentChallenge];

  if (!challenge) {
    return null;
  }

  const grade = () => {
    if (!nextFunction) {
      return;
    }
    const correct = nextFunction();
    const coursePath = `/course/${sheetId}`;
    if (correct) {
      if (currentChallenge < challenges.length - 2) {
        setCurrentChallenge(currentChallenge + 1);
      } else {
        history.push(coursePath);
      }
    } else {
      // put at end
      setChallenges([
        ...challenges.slice(0, currentChallenge),
        ...challenges.slice(currentChallenge + 1),
        challenge,
      ]);
    }
  };

  let challengeContainer = <pre>{JSON.stringify(challenge, null, 2)}</pre>;

  const nextFunctionSetter = (setter: NextFunction) =>
    setNextFunction(() => setter);

  switch (challenge.type) {
    case "judge": {
      challengeContainer = (
        <JudgeChallenge
          challenge={challenge}
          setNextFunction={nextFunctionSetter}
        />
      );
      break;
    }
    case "translate": {
      challengeContainer = (
        <TranslateChallenge
          challenge={challenge}
          setNextFunction={nextFunctionSetter}
        />
      );
      break;
    }
  }

  return (
    <>
      <div key={currentChallenge}>{challengeContainer}</div>
      <button disabled={!nextFunction} onClick={grade}>
        Next
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
