// server/utils/keywordGenerator.js
const { generatePrefixes } = require("./prefixUtils");

function tokenize(name) {
  // replace non-alnum with space, split, filter
  return name
    .replace(/[^a-zA-Z0-9]/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

module.exports = function keywordGenerator(filename) {
  const tokens = tokenize(filename);
  const set = new Set();

  tokens.forEach(tok => {
    if (tok.length === 0) return;
    // add the original token
    set.add(tok);
    // add prefixes
    generatePrefixes(tok).forEach(p => set.add(p));
  });

  return Array.from(set); // stored as lowercase tokens and prefixes
};
