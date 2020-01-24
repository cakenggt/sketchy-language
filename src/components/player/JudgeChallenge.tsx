import * as React from "react";
import { useState } from "react";

import { JudgeChallenge } from "../../utils/generators";
import { SetNextFunction } from "./LessonPlayer";

const JudgeChallengeElement = ({
  challenge,
  setNextFunction,
}: {
  challenge: JudgeChallenge;
  setNextFunction: SetNextFunction;
}) => {
  const { choices, prompt, correctIndices } = challenge;
  const [choice, setChoice] = useState<number>(null);

  return (
    <div>
      <h2>{prompt}</h2>
      {choices.map((choiceText, i) => (
        <button
          disabled={choice === null ? false : true}
          key={i}
          onClick={() => {
            setChoice(i);
            setNextFunction(() => correctIndices.includes(i));
          }}
        >
          {choiceText}
        </button>
      ))}
    </div>
  );
};

export default JudgeChallengeElement;