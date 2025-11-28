// server/utils/sanitize.js
exports.string = function (s) {
  if (typeof s !== "string") return "";
  return s.replace(/[<>$;]/g, "").trim();
};
