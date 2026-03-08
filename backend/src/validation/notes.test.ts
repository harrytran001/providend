import { addNoteBodySchema } from './notes';

describe('addNoteBodySchema', () => {
  it('accepts valid body with non-empty content', () => {
    const result = addNoteBodySchema.safeParse({ content: 'Some note text' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.content).toBe('Some note text');
  });

  it('rejects missing content', () => {
    const result = addNoteBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects empty string content', () => {
    const result = addNoteBodySchema.safeParse({ content: '' });
    expect(result.success).toBe(false);
  });

  it('rejects content over 10000 characters', () => {
    const result = addNoteBodySchema.safeParse({ content: 'x'.repeat(10_001) });
    expect(result.success).toBe(false);
  });

  it('accepts content with exactly 10000 characters', () => {
    const result = addNoteBodySchema.safeParse({ content: 'x'.repeat(10_000) });
    expect(result.success).toBe(true);
  });

  it('rejects non-string content', () => {
    const result = addNoteBodySchema.safeParse({ content: 123 });
    expect(result.success).toBe(false);
  });
});
