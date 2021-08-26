import styled from "styled-components";
import themeGet from "@styled-system/theme-get";

const List = styled.ul`
  padding-left: 2em;
  ul,
  ol {
    margin-top: 0;
    margin-bottom: 0;
  }

  li {
    overflow-wrap: break-word;
    word-break: break-all;
  }

  li > p {
    margin-top: ${themeGet("space.3")};
  }

  li + li {
    margin-top: ${themeGet("space.1")};
  }
`;

export default List;
