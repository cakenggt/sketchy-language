import * as React from "react";
import { useEffect, useState } from "react";
import { WiredButton } from "react-wired-element";
import styled from "styled-components";
import _ from "underscore";

import { TranslateChallenge } from "../../utils/generators";
import { SetNextFunction } from "./LessonPlayer";
import HintSentence from "../HintSentence";
import WiredUnderline from "../WiredUnderline";

const HintSentenceContainer = styled.div`
  margin: 20px 0;
`;

const AnswersArea = styled.div`
  min-height: 35px;
  min-width: 50px;
`;

const AnswersContainer = styled.div`
  margin-bottom: 20px;
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
        nextFunction: () =>
          correctIndices.map(i => choices[i].text).join(" ") ===
          answers.map(i => choices[i].text).join(" "),
      }),
    [answers],
  );

  return (
    <div>
      <HintSentenceContainer>
        <HintSentence tokens={tokens} />
      </HintSentenceContainer>
      <AnswersContainer>
        <WiredUnderline>
          <AnswersArea>
            {answers.length ? (
              answers.map((answer, i) => {
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
              })
            ) : (
              <WiredButton style={{ visibility: "hidden" }}>
                placeholder
              </WiredButton>
            )}
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
