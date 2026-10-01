// Sentences that were committed before a rule caught them. Each one is copied from the
// commit or the transcript it escaped in, byte for byte, including where the line wrapped.
//
// A rule added in response to a miss goes here with the text that motivated it, and the
// assertion in bin/test-prose.mjs states the check and severity that text must produce.
// Writing a fresh one-line example instead is how the miss below survived being fixed:
// the pattern worked on the example and could not cross the line break in the real file.

/**
 * 2026-09-21, jw-library token-hit-testing.ts line 45. The `name` verb was a warning and
 * its pattern used a literal space, so a wrapped block comment matched nothing at all.
 *
 * The last token in document order is the one that ends on that last line, so it names
 * the block the reader tapped beside.
 */
export function wrappedNameVerb(): void {
   return;
}

/** The other multi-word pattern, wrapped the same way. */
export function wrappedTwoWordPattern(): void {
   // Both readings agree, which underscores
   // the point that one sample was enough.
   return;
}

/**
 * 2026-09-26, jw-library MR 705 draft notes 40673 and 40674, from .orch/push-and-reply.sh.
 * The `name` verb had its object before it, so the rule that looks for a determiner after
 * the verb matched nothing, and no word list had the noun in line 32 at all.
 *
 * Taken, in the shape you named. The test builds a run with `tap(1); tap(2)` first, then
 * Mutation-checked. `if (!tapEl || tapEl.closest('a'))`, the early return you named, fails
 */
export function objectBeforeNameVerb(): void {
   return;
}
