import * as React from "react";
import { useState } from "react";
import { WiredButton, WiredProgress } from "react-wired-element";
import styled from "styled-components";
import _ from "underscore";

import { Challenge } from "../../utils/generators";
import JudgeChallenge from "./JudgeChallenge";
import TranslateChallenge from "./TranslateChallenge";

type NextFunction = () => boolean;
export type SetNextFunction = ({
  nextFunction,
}: {
  nextFunction: NextFunction;
}) => void;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChallengeContainer = styled.div`
  margin: 20px 0;
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default ({
  challenges: initialChallenges,
  onFinish,
}: {
  challenges: Challenge[];
  onFinish: () => void;
}) => {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [{ nextFunction }, setNextFunction] = useState<{
    nextFunction?: () => boolean;
  }>({});
  const [status, setStatus] = useState<"waiting" | "correct" | "incorrect">(
    "waiting",
  );

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
      onFinish();
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
    <Container>
      <ProgressContainer>
        <WiredProgress
          value={currentChallenge}
          min={0}
          max={challenges.length}
        />
      </ProgressContainer>
      <ChallengeContainer key={currentChallenge}>
        {challengeContainer}
      </ChallengeContainer>
      {status === "incorrect" ? (
        <div>Incorrect: {challenge.correctString}</div>
      ) : null}
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
    </Container>
  );
};
