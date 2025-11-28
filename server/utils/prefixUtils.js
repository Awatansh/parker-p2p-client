// server/utils/prefixUtils.js
const MIN_PREFIX_LENGTH = Number(process.env.MIN_PREFIX_LENGTH) || 2;

function generatePrefixes(word) {
  const w = (word || "").toLowerCase();
  const out = [];
  for (let i = MIN_PREFIX_LENGTH; i <= w.length; i++) {
    out.push(w.slice(0, i));
  }
  return out;
}

module.exports = { generatePrefixes };
