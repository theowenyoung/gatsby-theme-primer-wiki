const parse = require("../parse.js");
const { getContent } = require("../util");
describe("summary", () => {
  test("parse summary1", async () => {
    const content = await getContent("__tests__/summary.md");
    const parsed = await parse(content);
    // console.log('parsed', JSON.stringify(parsed, null, 2))
    expect(parsed.groups[0].title).toBe("Group1");
    expect(parsed.groups[0].items[0].title).toBe("Getting started");
    expect(parsed.groups[1].items[0].ref).toBe("contributing.mdx");
  });

  test("parse summary2", async () => {
    const content = await getContent("__tests__/summary2.md");
    const parsed = await parse(content);
    // console.log('parsed', JSON.stringify(parsed, null, 2))

    expect(parsed.groups[0].title).toBe("Getting Started");
    expect(parsed.groups[0].items[0].title).toBe("Gatsby CLI");
    expect(parsed.groups[1].items[0].ref).toBe("usage/customization.mdx");
    expect(parsed.groups[2].items[0].title).toBe("Daily notes");
  });
});
