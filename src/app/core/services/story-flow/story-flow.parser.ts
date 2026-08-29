import {
  type CanvasDocument,
  type RiddleFrontmatter,
  type RoutingFrontmatter,
  type StandardFrontmatter,
  type StoryFragmentFrontmatter,
  type StoryFragmentKind,
} from '../../../shared/models/story-flow.model';

export interface ParsedFragmentMarkdown {
  kind: StoryFragmentKind;
  frontmatter: StoryFragmentFrontmatter;
  content: string;
}

export function parseCanvas(rawCanvas: string): CanvasDocument {
  const parsed = JSON.parse(rawCanvas) as Partial<CanvasDocument>;
  console.log('%c parsed', 'color: #4CAF50; font-weight: bold;',  parsed);
  return {
    nodes: parsed.nodes ?? [],
    edges: parsed.edges ?? [],
  };
}

export function extractFragmentName(nodeText: string): string | null {
  const match = nodeText.match(/\[\[([^\]]+)\]\]/);
  return match ? match[1].trim() : null;
}

export function parseFragmentMarkdown(rawMarkdown: string, fragmentName?: string): ParsedFragmentMarkdown {
  const { frontmatterText, body } = splitFrontmatter(rawMarkdown);
  const content = body.trim();

  if (!frontmatterText?.trim()) {
    return { kind: 'standard', frontmatter: null, content };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(frontmatterText);
  } catch (error) {
    console.error(
      `Frontmatter JSON invalide dans le fragment "${fragmentName ?? '?'}" — il sera traité comme un fragment standard sans effet. Détail : ${(error as Error).message}`,
    );
    return { kind: 'standard', frontmatter: null, content };
  }

  if (!isRecord(parsed)) {
    return { kind: 'standard', frontmatter: null, content };
  }

  if (parsed['type'] === 'riddle') {
    return { kind: 'riddle', frontmatter: parsed as unknown as RiddleFrontmatter, content };
  }

  if (parsed['type'] === 'routing') {
    return { kind: 'routing', frontmatter: parsed as unknown as RoutingFrontmatter, content };
  }

  return { kind: 'standard', frontmatter: parsed as unknown as StandardFrontmatter, content };
}

export function toAssetUrl(...segments: string[]): string {
  return `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;
}

export function splitFrontmatter(rawMarkdown: string): { frontmatterText: string | null; body: string } {
  const normalized = rawMarkdown.replace(/^﻿/, '');
  const lines = normalized.split(/\r?\n/);

  let start = 0;
  while (start < lines.length && lines[start].trim() === '') {
    start += 1;
  }

  if (lines[start]?.trim() !== '---') {
    return { frontmatterText: null, body: normalized };
  }

  const endIndex = lines.findIndex((line, index) => index > start && line.trim() === '---');
  if (endIndex === -1) {
    return { frontmatterText: null, body: normalized };
  }

  return {
    frontmatterText: lines.slice(start + 1, endIndex).join('\n'),
    body: lines.slice(endIndex + 1).join('\n'),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
