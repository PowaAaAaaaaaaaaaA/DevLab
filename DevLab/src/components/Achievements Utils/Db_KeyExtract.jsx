// Returns an array of SQL keywords used in a query
export const extractSqlKeywords = (query) => {
  const keywordRegex = /\b(SELECT|AND|NOT|UPDATE|LIKE|BETWEEN|DELETE)\b/gi;
  const keywords = [];
  let match;

  while ((match = keywordRegex.exec(query)) !== null) {
    keywords.push(match[1].toUpperCase());
  }

  return [...new Set(keywords)]; // remove duplicates
};
