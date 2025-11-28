// server/tests/keywordGenerator.test.js
const keywordGenerator = require("../utils/keywordGenerator");

describe("keywordGenerator", () => {
  test("tokenizes and adds prefixes", () => {
    const keywords = keywordGenerator("Stark_Industries_Report.pdf");
    // should include 'stark' and a prefix 'st' or 'sta' depending on MIN_PREFIX_LENGTH
    expect(keywords).toEqual(expect.arrayContaining(['stark', 'industries', 'report', 'pdf']));
    // prefixes included:
    expect(keywords.some(k => k === 'st' || k === 'sta')).toBe(true);
  });

  test("handles empty filename", () => {
    const keywords = keywordGenerator("");
    expect(Array.isArray(keywords)).toBe(true);
    expect(keywords.length).toBe(0);
  });
});
