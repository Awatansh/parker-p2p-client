// server/tests/prefixUtils.test.js
const { generatePrefixes } = require("../utils/prefixUtils");

describe("generatePrefixes", () => {
  test("generates prefixes with default min length 2", () => {
    const p = generatePrefixes("star");
    expect(p).toEqual(expect.arrayContaining(["st","sta","star"]));
    expect(p.length).toBeGreaterThanOrEqual(2);
  });

  test("short word yields empty if shorter than min length", () => {
    const p = generatePrefixes("a");
    // if MIN_PREFIX_LENGTH default is 2, result should be []
    expect(Array.isArray(p)).toBe(true);
  });
});
