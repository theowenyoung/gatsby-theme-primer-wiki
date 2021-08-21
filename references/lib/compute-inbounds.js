"use strict";

var _nonNullable = require("./non-nullable");

function hasChildInArrayExcept(node, array, except, getNode) {
  return node.children.some(id => {
    if (id === except) {
      return false;
    }

    if (array.some(x => x.id === id)) {
      return true;
    }

    const child = getNode(id);

    if (!child || !child.children || !child.children.length) {
      return false;
    }

    return hasChildInArrayExcept(child, array, except, getNode);
  });
}

function getInboundReferences(getNode, allNodes) {
  const nodes = allNodes;
  const inboundReferences = {};
  function getRef(item) {
    return nodes.find(x => {
      return x.fields.slug === item;
    });
  }

  nodes.forEach(node => {
    const mapped = node.__outboundReferencesSlugs
      .map(getRef)
      .filter(_nonNullable.nonNullable)
      .map(x => x.id);

    mapped.forEach(x => {
      if (!inboundReferences[x]) {
        inboundReferences[x] = [];
      }
      // deduplation
      if (!inboundReferences[x].map(y => y.id).includes(node.id)) {
        inboundReferences[x].push(node);
      }
    });
  });

  Object.keys(inboundReferences).forEach(nodeId => {
    inboundReferences[nodeId] = inboundReferences[nodeId].filter(
      node =>
        getNode(node.parent) &&
        !hasChildInArrayExcept(
          getNode(node.parent),
          inboundReferences[nodeId],
          node.id, // @ts-ignore
          getNode
        )
    );
  });
  const inboundReferencesId = Object.keys(inboundReferences).reduce(
    (prev, x) => {
      prev[x] = inboundReferences[x].map(y => y.id);
      return prev;
    },
    {}
  );
  return inboundReferencesId;
}

exports.getInboundReferences = getInboundReferences;
