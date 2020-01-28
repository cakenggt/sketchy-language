import * as React from "react";
import { useRef, useState, useLayoutEffect } from "react";
import ReactRough, { Line } from "react-rough";
import styled from "styled-components";

const Container = styled.div`
  display: inline-block;
  position: relative;
`;

const Absolute = styled.div`
  display: inline-block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  z-index: 0;
  pointer-events: none;
`;

const Child = styled.div`
  display: inline-block;
  position: relative;
  z-index: 1;
`;

export default ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = containerRef.current as HTMLSpanElement;
    const rect = element
      ? element.getBoundingClientRect()
      : { height: 0, width: 0 };
    setWidth(rect.width);
    setHeight(rect.height);
  });

  return (
    <Container ref={containerRef}>
      <Child>{children}</Child>
      <Absolute>
        <ReactRough renderer="svg">
          <Line x1={0} x2={width} y1={height} y2={height} />
        </ReactRough>
      </Absolute>
    </Container>
  );
};
