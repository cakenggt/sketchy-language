import * as React from "react";
import WiredUnderline from "./WiredUnderline";

import styled from "styled-components";

const StyledLink = styled.a`
  text-decoration: none;
`;

export default () => (
  <>
    <h1>Sketchy Language</h1>
    <h2>About</h2>
    <p>
      Sketchy Language is a project that aims to put language course creation in
      the hands of anyone with enough ambition to undertake it. The courses on
      this site are powered by Google Spreadsheets in the background, removing
      the need for domain-specific software in course creation.
    </p>
    <p>
      Progress on this site is saved on the browser itself, so you will need to
      come back on the same browser on the same computer to keep your progress.
    </p>
    <h3>How Do I Create A Course?</h3>
    <p>
      Starting to create a course is easy, but seeing it through takes a lot of
      effort, as most good courses should have several thousand sentences for
      instruction. See{" "}
      <WiredUnderline>
        <StyledLink href="https://docs.google.com/spreadsheets/d/10K0tHSNzZcmhPcXvM6CdEM9zZUretPTqKOEZAbYuhA0/edit?usp=sharing">
          the course template spreadsheet
        </StyledLink>
      </WiredUnderline>{" "}
      for instructions on how to get started.
    </p>
    <h3>Help</h3>
    <WiredUnderline>
      <StyledLink href="https://docs.google.com/forms/d/e/1FAIpQLScgHgx26mdWB3ddUfHk57rm_63qUT5JVHM6y5U0QfN3f5c7Tw/viewform?usp=sf_link">
        Submit feedback here
      </StyledLink>
    </WiredUnderline>
  </>
);
