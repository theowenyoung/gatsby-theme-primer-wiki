import React from "react";
import SkipLink from "./skip-link";

function wrapPageElement({ element }) {
  return (
    <>
      <SkipLink />
      {element}
    </>
  );
}

export default wrapPageElement;
