import { FunctionComponent, h } from "preact";
import { styled } from "goober";

const DialogOuter = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const DialogInner = styled("div")`
  transform: translate(-50%, -50%);
`;

export const Dialog: FunctionComponent = ({ children }) => {
  return (
    <DialogOuter>
      <DialogInner>{children}</DialogInner>
    </DialogOuter>
  );
};
