export interface CanvasNode {
  id: string;
  type: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export interface CanvasEdge {
  id: string;
  fromNode: string;
  fromSide: string;
  toNode: string;
  toSide: string;
}

export interface CanvasDocument {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface RiddleAnswer {
  text: string;
  destination: string;
  increment?: number;
}

export interface RiddleFrontmatter {
  type: 'riddle';
  question: string;
  answers: RiddleAnswer[];
}

export interface RoutingBranch {
  condition: string;
  destination: string;
}

export interface RoutingFrontmatter {
  type: 'routing';
  variable_to_test: string;
  branches: RoutingBranch[];
}

export type StoryFragmentKind = 'standard' | 'riddle' | 'routing';

export type StoryFragmentFrontmatter = RiddleFrontmatter | RoutingFrontmatter | null;

export interface Fragment {
  name: string;
  kind: StoryFragmentKind;
  frontmatter: StoryFragmentFrontmatter;
  content: string;
  outgoingFragmentNames: string[];
}