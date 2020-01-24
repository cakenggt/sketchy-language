import * as React from "react";
import { useEffect, useState } from "react";
import _ from "underscore";

import { TranslateChallenge } from "../../utils/generators";
import { SetNextFunction } from "./LessonPlayer";

const TranslateChallengeElement = ({
  challenge,
  setNextFunction,
}: {
  challenge: TranslateChallenge;
  setNextFunction: SetNextFunction;
}) => {
  const { choices, prompt, correctIndices } = challenge;
  const [answers, setAnswers] = useState([] as number[]);

  useEffect(
    () =>
      setNextFunction(() => _.difference(correctIndices, answers).length === 0),
    [answers],
  );

  return (
    <div>
      <h2>{prompt}</h2>
      <div>
        {answers.map((answer, i) => {
          const choice = choices[answer];
          return (
            <button
              key={answer}
              onClick={() =>
                setAnswers([...answers.slice(0, i), ...answers.slice(i + 1)])
              }
            >
              {choice.text}
            </button>
          );
        })}
      </div>
      <div>
        {choices
          .map((choice, i) => ({ choice, i }))
          .filter(({ i }) => !answers.includes(i))
          .map(({ choice, i }) => (
            <button
              key={i}
              onClick={() => {
                setAnswers([...answers, i]);
              }}
            >
              {choice.text}
            </button>
          ))}
      </div>
    </div>
  );
};

export default TranslateChallengeElement;
