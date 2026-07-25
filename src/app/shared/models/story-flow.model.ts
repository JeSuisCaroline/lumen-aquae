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
  label?: string;
}

export interface CanvasDocument {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface ResourceEffects {
  FLO?: number;
  HOP?: number;
}

export interface RiddleAnswer {
  text: string;
  destination: string;
  increment?: number;
}

export interface RiddleFrontmatter extends ResourceEffects {
  type: 'riddle';
  question: string;
  answers: RiddleAnswer[];
}

export interface RoutingBranch {
  condition: string;
  destination: string;
}

export interface RoutingFrontmatter extends ResourceEffects {
  type: 'routing';
  variable_to_test: string;
  branches: RoutingBranch[];
}

export interface StandardFrontmatter extends ResourceEffects {
  type?: 'standard';
}

export type StoryFragmentKind = 'standard' | 'riddle' | 'routing';

export type StoryFragmentFrontmatter = StandardFrontmatter | RiddleFrontmatter | RoutingFrontmatter | null;

export interface OutgoingChoice {
  name: string;
  label?: string;
}

export interface Fragment {
  name: string;
  kind: StoryFragmentKind;
  frontmatter: StoryFragmentFrontmatter;
  content: string;
  outgoingChoices: OutgoingChoice[];
}