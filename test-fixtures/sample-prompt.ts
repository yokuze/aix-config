// prose-lint: strings
//
// A fixture for the opt-in pass. A prompt body assigned to a name has no call to anchor
// on, so a file says for itself that its strings are prose.

const CI_FIX_BODY =
   'CI failed on this branch. Find the seamless root cause, commit as fixups, '
   + 'and push with a robust --force-with-lease.';

const STEPS = [
   'Read the task file first.',
   'Write a comprehensive plan before you implement.',
].join('\n');

export const PROMPTS = { CI_FIX_BODY, STEPS };
