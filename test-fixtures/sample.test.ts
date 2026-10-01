// A fixture for the source-string pass. Every reported term uses a different call form,
// and the lines that must stay unread contain a term too.
import { describe, expect, it } from 'vitest';

describe('the seamless import flow', () => {
   it('refuses a robust `--guardrail` argument', () => {
      const path = 'src/holistic/paths.ts';

      expect(readTarget(path), 'a comprehensive message').toEqual({ ok: true });
   });
});

program
   .command('sync')
   .description('Pull a cutting-edge snapshot of the remote')
   .option('--force <mode>', 'Overwrite a pivotal local change');

function readTarget(path: string): { ok: boolean } {
   if (!/robust/.test(path)) {
      log.warn('the vital file is missing');
      throw new Error('a crucial failure');
   }

   return { ok: true };
}
