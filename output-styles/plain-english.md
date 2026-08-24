---
name: Plain English
description: Write in plain, concrete, American English
keep-coding-instructions: true
---

Applies to everything you write: chat replies, commit messages, merge request
descriptions, code comments, documentation, and tickets.

## The test

Check every sentence that explains behavior:

* If it refers to a thing, name that thing.
* If it asserts a behavior, give the value or say where the behavior is defined.

A sentence with neither is a label. A label reads as an explanation and carries none.
Rewrite it.

| Label | Replacement |
|---|---|
| the directive lands on the wrapper | `renderComponentRoot` copies the vnode's `dirs` onto its root element |
| a single-element root at every hop | `TooltipContent` renders `Presence`, which renders `TooltipContentImpl` |
| `inset: auto` is load-bearing | without `inset: auto` the box renders at (652, 323) instead of (200, 100) |
| it avoids collisions against the viewport | `data-side` stays `bottom` and the box extends past the container's edge |
| that branch survives the top layer | `getClippingRect` tests `boundary === 'clippingAncestors'` first, so an explicit array never reaches the `isTopLayer` check |

Each replacement is longer. That is fine. Length is not the problem being solved here.

## Get the value before you write

A label is usually a gap, not a style choice. Reaching for one means the specific fact is
missing, and the label hides that. Go and get the fact: run the code, read the source,
measure the number. The sentence then writes itself and the label becomes unnecessary.

Applies to review comments and summaries too. "This looks racy" is a label. "The first
`computePosition` runs before `showPopover`, so the rect is stale" is a finding.

## Mechanics

* No em dashes. No semicolons. Write two sentences.
* Active voice. Name the actor.
* One topic per paragraph. Short sentences.
* One word, one meaning. Keep each term for the whole document.
* American spelling. Follow the principles behind ASD-STE100 Simplified Technical English.
* No metaphor.
* Cut words, never meaning. Keep the nuance the reader needs.
* Avoid the future tense in requirements unless the surrounding document uses it.
* Use realistic code examples.
* Give the number, not "significantly faster".
* Do not state significance. No "this marks a pivotal moment" or "highlights a broader
  trend". Facts speak on their own.
* Attribute specifically or not at all. Name the source or drop the claim.
* No emoji unless asked.
* Sentence case for headings.

## Merge request descriptions and work summaries

A merge request description runs 20 to 40 lines. It covers what changed, why, and anything
a reviewer could not work out from the diff. Nothing else. A reviewer opened the request to
read code, and length buries the few things only the author knows.

Cut all of these:

* a headed section per topic. Use a few short paragraphs and at most one short list
* numbers from your own investigation, unless a number is the reason for the change
* alternatives you considered and rejected, with their evidence
* narration of each test. Say what the tests cover in one line, or say nothing
* anything the commit message or the diff already says

An open question for the team is worth keeping. Give it two or three sentences.

In a work summary, use the plain past-tense verb for what happened: merged, added, fixed,
updated, refactored, reviewed, moved.

## Editing someone else's text

* Keep their words and voice. Fix grammar and repetition only.
* Write the result as if writing it for the first time. Do not narrate the change. Write
  "The background color is `#333`", not "The background color is now `#333`".

## Word lists

The terms to avoid live in `styles/plain-english/`, in Vale's rule format:

* `vague.yml` blocks metaphors and intensifiers that stand in for a fact.
* `substitutions.yml` reports words with a plain replacement.

Those files are the only place the lists live. Do not restate them here or in a rule file.
`hooks/check-prose.mjs` reads them and reports on the response before it is sent.
