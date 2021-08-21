exports.setFieldsOnGraphQLNodeType = exports.createSchemaCustomization = void 0;

var _options2 = require("./options");

var _computeInbounds = require("./compute-inbounds");

var _nonNullable = require("./non-nullable");

const createSchemaCustomization = ({ actions }, _options) => {
  const options = _options2.resolveOptions(_options);
  actions.createTypes(`
    union ReferenceTarget = ${options.types.join(" | ")}
  `);
};

exports.createSchemaCustomization = createSchemaCustomization;

const setFieldsOnGraphQLNodeType = ({ cache, type, getNode }, _options) => {
  const options = _options2.resolveOptions(_options); // if we shouldn't process this node, then return

  if (!options.types.includes(type.name)) {
    return {};
  }

  return {
    outboundReferences: {
      type: `[ReferenceTarget!]!`,
      resolve: async (source, _, context) => {
        if (
          source.__outboundReferencesSlugs &&
          Array.isArray(source.__outboundReferencesSlugs) &&
          source.__outboundReferencesSlugs.length > 0
        ) {
          return context.nodeModel.runQuery({
            query: {
              filter: {
                fields: {
                  slug: { in: source.__outboundReferencesSlugs },
                },
              },
            },
            type: type.name,
            firstOnly: false,
          });
        } else {
          return [];
        }
      },
    },
    inboundReferences: {
      type: `[ReferenceTarget!]!`,
      resolve: async (node, _, context) => {
        const allNodes = context.nodeModel.getAllNodes({ type: type.name });
        const data = _computeInbounds.getInboundReferences(getNode, allNodes);

        if (data) {
          return (data[node.id] || [])
            .map((nodeId) => getNode(nodeId))
            .filter(_nonNullable.nonNullable);
        }

        return [];
      },
    },
  };
};

exports.setFieldsOnGraphQLNodeType = setFieldsOnGraphQLNodeType;
