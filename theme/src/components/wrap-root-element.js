import "tippy.js/dist/tippy.css"; // optional
import "tippy.js/themes/light.css";
import { MDXProvider } from "@mdx-js/react";
import { theme, ThemeProvider } from "@primer/components";
import React from "react";
import components from "./mdx-components";
import deepmerge from "deepmerge";
const customTheme = deepmerge(theme, {
  colorSchemes: {
    light: {
      colors: {
        bg: {
          darkInput: "rgba(255, 255, 255, 0.07)",
        },
        headerSearch: {
          bg: "rgba(255, 255, 255, 0.07)",
        },
      },
    },
    dark: {
      colors: {
        bg: {
          darkInput: "rgba(27,31,35,0.07)",
        },
      },
    },
  },
});
function wrapRootElement({ element }) {
  return (
    <ThemeProvider theme={customTheme} colorMode="auto">
      <MDXProvider components={components}>{element}</MDXProvider>
    </ThemeProvider>
  );
}

export default wrapRootElement;
