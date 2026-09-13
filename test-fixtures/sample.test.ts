// A fixture for the source-string pass. Each reported term sits in a different call shape,
// and the lines that must stay unread hold a term too.
import { describe, expect, it } from 'vitest';

describe('the seamless import flow', () => {
   it('refuses a robust `--guardrail` argument', () => {
      const path = 'src/holistic/paths.ts';

      expect(readTarget(path), 'a comprehensive message').toEqual({ ok: true });
   });

   it.each([ 1, 2 ])('retries %i times', () => {});
});

function readTarget(path: string): { ok: boolean } {
   if (!/robust/.test(path)) {
      throw new Error('a pivotal failure');
   }

   return { ok: true };
}
