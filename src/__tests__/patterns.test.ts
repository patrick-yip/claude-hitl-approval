import { describe, it, expect } from 'bun:test';
import { matchesAnyRule } from '../shared/patterns';
import type { HitlRule } from '../shared/types';

const rules: HitlRule[] = [
  { tool: 'Bash', pattern: 'rm *' },
  { tool: 'Bash', pattern: 'git push*' },
  { tool: 'Write', pattern: '*' },
];

describe('matchesAnyRule', () => {
  it('returns the matched rule for rm with wildcard', () => {
    const result = matchesAnyRule('Bash', 'rm -rf ./dist', rules);
    expect(result).toEqual({ tool: 'Bash', pattern: 'rm *' });
  });

  it('returns the matched rule for git push with args', () => {
    const result = matchesAnyRule('Bash', 'git push origin main', rules);
    expect(result).toEqual({ tool: 'Bash', pattern: 'git push*' });
  });

  it('returns the matched rule for any Write command', () => {
    const result = matchesAnyRule('Write', '/any/path.txt', rules);
    expect(result).toEqual({ tool: 'Write', pattern: '*' });
  });

  it('returns null for safe Bash command', () => {
    expect(matchesAnyRule('Bash', 'ls -la', rules)).toBeNull();
  });

  it('returns null for wrong tool', () => {
    expect(matchesAnyRule('Read', '/some/path.txt', rules)).toBeNull();
  });

  it('returns null for empty rules', () => {
    expect(matchesAnyRule('Bash', 'rm foo', [])).toBeNull();
  });

  it('is truthy when matched (backward compat)', () => {
    expect(!!matchesAnyRule('Bash', 'rm foo', rules)).toBe(true);
  });

  it('is falsy when not matched (backward compat)', () => {
    expect(!!matchesAnyRule('Bash', 'ls', rules)).toBe(false);
  });
});
