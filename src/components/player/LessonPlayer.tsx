import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { WiredButton, WiredProgress } from "react-wired-element";
import _ from "underscore";

import { courseSelector, lessonSelector } from "../../selectors";
import { State } from "../../utils/store";
import { loadCourse, Dispatch, Course, Lesson } from "../../actions";
import { Challenge } from "../../utils/generators";
import JudgeChallenge from "./JudgeChallenge";
import TranslateChallenge from "./TranslateChallenge";

type NextFunction = () => boolean;
export type SetNextFunction = ({
  nextFunction,
}: {
  nextFunction: NextFunction;
}) => void;

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
  const [{ nextFunction }, setNextFunction] = useState<{
    nextFunction?: () => boolean;
  }>({});
  const [status, setStatus] = useState<"waiting" | "correct" | "incorrect">(
    "waiting",
  );
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

    setStatus(correct ? "correct" : "incorrect");

    if (!correct) {
      // put at end
      setChallenges([...challenges, challenge]);
    }
  };

  const isLastChallenge = currentChallenge === challenges.length - 1;

  const next = () => {
    setStatus("waiting");
    if (isLastChallenge) {
      history.push(`/course/${sheetId}`);
    } else {
      setCurrentChallenge(currentChallenge + 1);
    }
  };

  let challengeContainer = <pre>{JSON.stringify(challenge, null, 2)}</pre>;

  switch (challenge.type) {
    case "judge": {
      challengeContainer = (
        <JudgeChallenge
          challenge={challenge}
          setNextFunction={setNextFunction}
        />
      );
      break;
    }
    case "translate": {
      challengeContainer = (
        <TranslateChallenge
          challenge={challenge}
          setNextFunction={setNextFunction}
        />
      );
      break;
    }
  }

  return (
    <>
      <WiredProgress value={currentChallenge} min={0} max={challenges.length} />
      <div key={currentChallenge}>{challengeContainer}</div>
      <WiredButton
        style={{
          color:
            status === "waiting"
              ? "none"
              : status === "correct"
              ? "green"
              : "red",
        }}
        disabled={!!nextFunction ? null : true}
        key={status}
        onClick={status === "waiting" ? grade : next}
      >
        {status === "waiting" ? "Grade" : isLastChallenge ? "Finish" : "Next"}
      </WiredButton>
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
