import * as React from "react";

import { useHistory } from "react-router";
import { WiredButton } from "react-wired-element";

export default ({
  disabled,
  href,
  children,
  ...rest
}: {
  disabled?: boolean;
  href: string;
  children: React.ReactNode;
}) => {
  const history = useHistory();
  return (
    <WiredButton
      disabled={disabled}
      onClick={() => history.push(href)}
      {...rest}
    >
      {children}
    </WiredButton>
  );
};
