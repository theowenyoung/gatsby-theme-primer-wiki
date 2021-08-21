"use strict";

const {
  getReferences,
  getOutboundReferencesSlugs
} = require("./get-references");

var _options2 = require("./options");

const onCreateNode = async ({ node, loadNodeContent, getNode }, _options) => {
  const options = _options2.resolveOptions(_options); // if we shouldn't process this node, then return

  if (!options.types.includes(node.internal.type)) {
    return;
  }

  if (node.fields && node.fields.slug) {
    const content = await loadNodeContent(node);
    const outboundReferences = await getReferences(content, {
      ...options,
      node,
      getNode
    });
    const outboundReferencesSlugs = getOutboundReferencesSlugs(
      outboundReferences
    );
    node.__outboundReferencesSlugs = outboundReferencesSlugs;
  } else {
    return;
  }
};

exports.onCreateNode = onCreateNode;
