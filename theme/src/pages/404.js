import React from "react";
import Seo from "../components/seo";

const NotFoundPage = ({ data, location }) => {
  return (
    <>
      <Seo post={{ title: "404: Not Found" }} />
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </>
  );
};

export default NotFoundPage;
