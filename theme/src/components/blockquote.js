import styled from "styled-components";
import themeGet from "@styled-system/theme-get";
//   color: ${themeGet("colors.auto.gray.5")};

const Blockquote = styled.blockquote`
  margin: 0 0 ${themeGet("space.5")} 0;
  padding: 0 ${themeGet("space.3")};
  border-left: 0.25em solid ${themeGet("colors.auto.gray.3")};
  color: ${themeGet("colors.auto.gray.7")};
  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
`;

export default Blockquote;
