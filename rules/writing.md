---
description: "Write clear, specific prose that sounds human. Avoid patterns common to AI writing."
---

The rules live in the Plain English output style, at `output-styles/plain-english.md`.
Read that file. There is no second copy of them here.

Word lists live in `styles/plain-english/`, in Vale's rule format. `hooks/check-prose.mjs`
reads those lists and checks the reply before it is sent.

The style reduces to one test. If a sentence refers to a thing, name that thing. If it
asserts a behavior, give the value or say where the behavior is defined. A sentence with
neither is a label, and a label reads as an explanation while carrying none.

Reaching for a label usually means the specific fact is missing. Go and get it: run the
code, read the source, measure the number. Then write.
