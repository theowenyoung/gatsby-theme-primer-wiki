import themeGet from "@styled-system/theme-get";
import styled from "styled-components";
import { variant } from "styled-system";

const Note = styled.div`
  padding: ${themeGet("space.3")};
  margin-bottom: ${themeGet("space.3")};
  border-radius: ${themeGet("radii.2")};
  border-left: ${themeGet("radii.2")} solid;

  & *:last-child {
    margin-bottom: 0;
  }

  ${variant({
    variants: {
      info: {
        borderColor: "auto.blue.4",
        bg: "auto.blue.0",
      },
      warning: {
        borderColor: "auto.yellow.5",
        bg: "auto.yellow.1",
      },
      danger: {
        borderColor: "auto.red.4",
        bg: "auto.red.0",
      },
    },
  })}
`;

Note.defaultProps = {
  variant: "info",
};

export default Note;
