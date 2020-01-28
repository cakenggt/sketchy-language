import * as React from "react";
import { useEffect, useState } from "react";
import { WiredButton } from "react-wired-element";
import styled from "styled-components";
import _ from "underscore";

import { TranslateChallenge } from "../../utils/generators";
import { SetNextFunction } from "./LessonPlayer";
import HintSentence from "../HintSentence";
import WiredUnderline from "../WiredUnderline";

const AnswersArea = styled.div`
  min-height: 35px;
  min-width: 50px;
`;

const AnswersContainer = styled.div`
  margin: 20px 0;
`;

const TranslateChallengeElement = ({
  challenge,
  setNextFunction,
}: {
  challenge: TranslateChallenge;
  setNextFunction: SetNextFunction;
}) => {
  const { choices, correctIndices, tokens } = challenge;
  const [answers, setAnswers] = useState([] as number[]);

  useEffect(
    () =>
      setNextFunction({
        nextFunction: () => _.difference(correctIndices, answers).length === 0,
      }),
    [answers],
  );

  return (
    <div>
      <div>
        <HintSentence tokens={tokens} />
      </div>
      <AnswersContainer>
        <WiredUnderline>
          <AnswersArea>
            {answers.map((answer, i) => {
              const choice = choices[answer];
              return (
                <WiredButton
                  key={answer}
                  onClick={() =>
                    setAnswers([
                      ...answers.slice(0, i),
                      ...answers.slice(i + 1),
                    ])
                  }
                >
                  {choice.text}
                </WiredButton>
              );
            })}
          </AnswersArea>
        </WiredUnderline>
      </AnswersContainer>
      <div>
        {choices
          .map((choice, i) => ({ choice, i }))
          .filter(({ i }) => !answers.includes(i))
          .map(({ choice, i }) => (
            <WiredButton
              key={i}
              onClick={() => {
                setAnswers([...answers, i]);
              }}
            >
              {choice.text}
            </WiredButton>
          ))}
      </div>
    </div>
  );
};

export default TranslateChallengeElement;
