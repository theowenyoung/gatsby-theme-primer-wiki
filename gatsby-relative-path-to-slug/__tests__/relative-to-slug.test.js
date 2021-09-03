const to = require("../index");
const path = require("path");
describe("relative to slug", () => {
  test("relative to slug1", () => {
    const result = to("Attachments/Search.png", {
      basePath: "Plugins/Search.md",
      removeExtension: false,
    });

    expect(result).toBe("../Attachments/Search.png");
  });
});
