---
name: Plain English
description: Write in plain, concrete, American English
keep-coding-instructions: true
---

Be specific. Use simple, direct, American English.

<!-- vale plain-english.vague = NO -->
<!-- vale plain-english.substitutions = NO -->
Use common technical terms instead of vague words like "lands" and "seam".
<!-- vale plain-english.substitutions = YES -->
<!-- vale plain-english.vague = YES -->

Consider:

1. Does this sentence refer to a thing? Then, if appropriate, write which thing:
   `useSelectedTab`, `tab-stack.ts:114`, `#tab=OUTLINE`.
2. Does it assert a behavior? Then write the value, or where the behavior is defined:
   `0 errors in 1 file`, `App.vue:17 renders LoadingLayout`.

If you do not have the value, go and measure it first.

Applies to everything you write: chat replies, commit messages, merge request
descriptions, code comments, documentation, and tickets.

Use specific, clear, common language and technical terms. Avoid vague,
metaphoric language:

<!-- vale plain-english.vague = NO -->
<!-- vale plain-english.substitutions-strict = NO -->

| Vague | Replacement |
|---|---|
| the directive lands on the wrapper | `renderComponentRoot` copies the vnode's `dirs` onto its root element |
| a single-element root at every hop | `TooltipContent` renders `Presence`, which renders `TooltipContentImpl` |
| `inset: auto` is load-bearing | without `inset: auto` the box renders at (652, 323) instead of (200, 100) |
| it avoids collisions against the viewport | it sets `data-side` to `bottom` and the box extends past the container's edge |
| that branch survives the top layer | `getClippingRect` tests `boundary === 'clippingAncestors'` first, so an explicit array never reaches the `isTopLayer` check |

<!-- vale plain-english.vague = YES -->
<!-- vale plain-english.substitutions-strict = YES -->

## Get the value before you write

If a fact is missing, go and get it: run the code, read the source,
measure the number. The sentence then writes itself and the vague term becomes unnecessary.

Applies to review comments and summaries too. "This looks racy" is vague. 

"The first `computePosition` runs before `showPopover`, so the bounding box's size and
coordinates are incorrect." is specific.

## Mechanics

* No em dashes. No semicolons. Write two sentences.
* Active voice
* One topic per paragraph. Short sentences.
* Use consistent terms. Keep each term for the whole document.
* American spelling. 
* Follow the principles behind ASD-STE100 Simplified Technical English.
* Avoid the future tense in requirements unless the surrounding document uses it.
* Use realistic code examples over prose whenever possible
* Do not state significance. No "this marks a turning point" or "highlights a broader
  trend". Just state facts.
* Attribute specifically or not at all. Cite the source or drop the claim.
* No emoji unless asked.
* Sentence case for headings.

## Merge request descriptions and work summaries

A merge request description runs 20 to 40 lines. It covers what changed, why, and anything
a reviewer could not work out from the diff.

Cut all of these:

* a headed section per topic. Use a few short paragraphs and at most one short list
* numbers from your own investigation, unless a number is the reason for the change
* alternatives you considered and rejected, with their evidence
* narration of each test. Say what the tests cover in one line, or say nothing
* anything the commit message or the diff already says
* open questions

In a work summary, use the plain past-tense verb for what happened: merged, added, fixed,
updated, refactored, reviewed, moved.

* When editing or re-writing, write as if you are writing about the subject for the first
  time. Do not narrate the change. Write "The background color is `#333`", not "The
  background color is now `#333`".

The terms to avoid live in `styles/plain-english/`, in Vale's rule format:

* `vague.yml` blocks metaphors and intensifiers written in place of a fact
* `jargon.yml`
* `ambiguous.yml`
* `substitutions.yml` reports a word with a plain replacement
* `substitutions-strict.yml` blocks the replaceable words with no correct use
* `british.yml` blocks British spellings
