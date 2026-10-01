// A positive test for prose, to sit alongside the Vale word lists.
//
// The word lists are a blocklist: a sentence passes when it contains no banned term. That
// leaves the whole failure mode open. Five sentences of "the change improves the overall
// structure and makes the behavior much more predictable" score 0 errors and 0 warnings,
// because every word in them is allowed.
//
// The before and after columns in the Plain English style differ by one property, and it
// is not vocabulary. Every "after" cell states something a reader can go and check: a
// symbol, a file, a coordinate, a branch condition. Every "before" cell states none of
// those. So the checkable rule is the positive one.
//
//    A sentence that makes a claim must state a symbol, a file, a value or a condition.
//
// `REFERENT` below is what counts as one of those. The exemptions are deliberately wide:
// a short connective sentence, a question and a heading assert nothing about the system,
// so none of them is checked. Length is the test. A sentence of 10 words or more that
// states no symbol, file, value or condition is what this reports.

const MIN_CLAIM_WORDS = 10;

// Spans that are themselves the evidence, read before anything is stripped.
const REFERENT = [
   /`[^`\n]+`/,                       // an inline code span
   /\b\d/,                            // a digit, which is a count, a version or a line
   /\b[\w.-]+\/[\w./-]+/,             // a path
   /\b\w+\.(?:ts|js|mjs|vue|rs|py|json|yml|yaml|md|scss|css|toml|sh)\b/i, // a filename
   /https?:\/\//,                     // a URL
   /"[^"\n]+"/,                       // a quoted literal
   /\b[a-z]+[A-Z]\w*/,                // camelCase
   /\b[A-Z][a-z]+[A-Z]\w*/,           // PascalCase
   /\b[A-Z][A-Z_]{2,}\b/,             // SCREAMING_CASE
   /\b\w+\(\)/,                       // a call
   /\*\*[^*\n]+\*\*/,                   // a bold span, which marks the term under discussion
];

// A reply is reported when this share of its claim-length sentences state no fact, and at
// least MIN_BARE of them do. One bare sentence in a long reply is a connective. Half of
// them is the failure the before column shows.
const BARE_SHARE = 0.4,
      MIN_BARE = 2;

/**
 * Sentences that make a claim and state no symbol, file, value or condition, as messages.
 * Empty when there are none.
 *
 * Fenced blocks and their contents are dropped first: code is not prose, and a sentence
 * that follows a block still has to stand on its own.
 */
export function evidenceProblems(text) {
   const prose = text
      .replace(/```[\s\S]*?```/g, '\n')
      .replace(/^\s*[|>#-].*$/gm, '')        // tables, quotes, headings, bullets
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

   const sentences = prose
      .split(/(?<=[.!?])\s+|\n{2,}/)
      .map((s) => { return s.trim(); })
      .filter(Boolean);

   const bare = sentences.filter((sentence) => {
      if (sentence.endsWith('?')) {
         return false;
      }

      if (sentence.split(/\s+/).length < MIN_CLAIM_WORDS) {
         return false;
      }

      return !REFERENT.some((pattern) => { return pattern.test(sentence); });
   });

   const claims = sentences.filter((sentence) => {
      return !sentence.endsWith('?') && sentence.split(/\s+/).length >= MIN_CLAIM_WORDS;
   });

   if (bare.length < MIN_BARE || bare.length / claims.length < BARE_SHARE) {
      return [];
   }

   return bare.map((sentence) => {
      const shown = sentence.length > 90 ? `${sentence.slice(0, 90)}…` : sentence;

      return `States no fact: "${shown}" Give the symbol, file, value or condition, or cut the sentence.`;
   });
}
