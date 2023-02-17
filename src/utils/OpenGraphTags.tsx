import React from "react";

const OpenGraphTags: React.FC = () => {
  return (
    <React.Fragment>
      <meta
        property="og:url"
        content="https://bazaar-react.vercel.app/landing"
      />
      {/* thumbnail And title for social media */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Supplier Dashboard" />
      <meta
        property="og:description"
        content="Supplier Dashboard"
      />
      <meta property="og:image" content="/assets/images/landing/preview.png" />
    </React.Fragment>
  );
};

export default OpenGraphTags;
