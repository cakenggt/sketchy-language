import * as React from "react";
import { useState } from "react";
import { Token } from "../utils/generators";
import { HintTable } from "../utils/hintTable";

const HintTable = ({ hintTable }: { hintTable: HintTable }) => {
  const { headers, rows } = hintTable;
  return (
    <table>
      <thead>
        {headers.map((header, i) => (
          <th key={i}>{header}</th>
        ))}
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map(({ colspan, hint }, j) => (
              <td colSpan={colspan} key={j}>
                {hint}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const HintToken = ({ token }: { token: Token }) => {
  const [showing, setShowing] = useState(false);

  return (
    <>
      <pre
        onMouseEnter={() => (token.hintTable ? setShowing(true) : null)}
        onMouseLeave={() => setShowing(false)}
      >
        {token.value}
      </pre>
      {showing ? <HintTable hintTable={token.hintTable} /> : null}
    </>
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
