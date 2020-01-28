import * as React from "react";

import { useHistory } from "react-router";
import { WiredButton } from "react-wired-element";

export default ({
  href,
  children,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const history = useHistory();
  return (
    <WiredButton onClick={() => history.push(href)} {...rest}>
      {children}
    </WiredButton>
  );
};
