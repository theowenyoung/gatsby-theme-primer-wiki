import themeGet from "@styled-system/theme-get";
import styled from "styled-components";

const Image = styled.img`
  max-width: 100%;
  box-sizing: content-box;
  background-color: ${themeGet("colors.auto.white")};
`;

export default Image;
