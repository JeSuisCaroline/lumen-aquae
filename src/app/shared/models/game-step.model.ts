export interface Step {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  nextStepId: string;
}
