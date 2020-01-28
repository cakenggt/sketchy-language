import * as React from "react";
import { useState } from "react";
import styled from "styled-components";

import WiredUnderline from "./WiredUnderline";
import { WiredCard } from "react-wired-element";
import { Token } from "../utils/generators";

const HintTable = ({ hintTable }: { hintTable: string[] }) => (
  <WiredCard
    style={{
      background: "white",
      position: "absolute",
      left: "0%",
      top: "100%",
      zIndex: 2,
    }}
  >
    {hintTable.map((hint, i) => (
      <WiredUnderline key={i}>{hint}</WiredUnderline>
    ))}
  </WiredCard>
);

const TokenContainer = styled.span`
  position: relative;
`;

const HasHintTable = styled.span`
  cursor: pointer;
`;

const HintToken = ({ token }: { token: Token }) => {
  const [showing, setShowing] = useState(false);

  return (
    <TokenContainer
      onMouseEnter={() => (token.hintTable ? setShowing(true) : null)}
      onMouseLeave={() => setShowing(false)}
    >
      {token.hintTable ? (
        <WiredUnderline>
          <HasHintTable>{token.value}</HasHintTable>
        </WiredUnderline>
      ) : (
        token.value
      )}
      {showing ? <HintTable hintTable={token.hintTable} /> : null}
    </TokenContainer>
  );
};

const HintSentence = ({ tokens }: { tokens: Token[] }) => {
  return (
    <div>
      {tokens.map((token, i) => (
        <HintToken key={i} token={token} />
      ))}
    </div>
  );
};

export default HintSentence;
