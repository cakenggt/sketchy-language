import * as React from "react";
import { useState } from "react";
import { WiredButton } from "react-wired-element";
import styled from "styled-components";

import { JudgeChallenge } from "../../utils/generators";
import { SetNextFunction } from "./LessonPlayer";
import HintSentence from "../HintSentence";

const HintSentenceContainer = styled.div`
  margin: 20px 0;
`;

const JudgeChallengeElement = ({
  challenge,
  setNextFunction,
}: {
  challenge: JudgeChallenge;
  setNextFunction: SetNextFunction;
}) => {
  const { choices, correctIndices, tokens } = challenge;
  const [choice, setChoice] = useState<number>(null);

  return (
    <div>
      <HintSentenceContainer>
        <HintSentence tokens={tokens} />
      </HintSentenceContainer>
      {choices.map((choiceText, i) => (
        <WiredButton
          style={{ background: choice === i ? "yellow" : "none" }}
          key={i}
          onClick={() => {
            setChoice(i);
            setNextFunction({ nextFunction: () => correctIndices.includes(i) });
          }}
        >
          {choiceText}
        </WiredButton>
      ))}
    </div>
  );
};

export default JudgeChallengeElement;
