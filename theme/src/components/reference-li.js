import styled from "styled-components";
import { themeGet } from "@primer/components";
const ReferenceLi = styled.li`
  margin-bottom: 10px;
  &:before {
    content: "\\2022";
    color: ${themeGet("colors.text.placeholder")};
    display: inline-block;
    width: ${themeGet("space.3")};
    margin-left: -${themeGet("space.3")};
  }
`;
export default ReferenceLi;
