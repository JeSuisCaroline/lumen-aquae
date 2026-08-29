import { type Rambling } from '../../../shared/models/rambling.model';
import { splitFrontmatter } from '../story-flow/story-flow.parser';

export function parseRamblingMarkdown(raw: string, id: string): Rambling {
  const { frontmatterText, body } = splitFrontmatter(raw);
  const parsed = JSON.parse(frontmatterText ?? body) as Partial<Rambling>;

  return {
    id,
    title: parsed.title ?? '',
    text: parsed.text ?? '',
  };
}