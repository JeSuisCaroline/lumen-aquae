import { Injectable, computed, inject, isDevMode } from '@angular/core';
import { type Choice, type Step } from '../../../shared/models/game-step.model';
import { type RiddleFrontmatter, type Fragment } from '../../../shared/models/story-flow.model';
import { StoryFlowService } from '../story-flow/story-flow.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly storyFlow = inject(StoryFlowService);

  readonly isReady = this.storyFlow.canvasLoaded;
  readonly gold = this.storyFlow.score;
  readonly fragmentNames = this.storyFlow.fragmentNames;
  readonly currentStep = computed<Step>(() => this.mapFragmentToStep(this.storyFlow.currentFragment()));

  constructor() {
    this.storyFlow.loadAndInitializeCanvasGraph().subscribe();
  }

  public restart(): void {
    this.storyFlow.restartStory();
  }

  public jumpToFragment(name: string): void {
    this.storyFlow.goToFragment(name);
  }

  public goToStep(stepId: string, _goldBonus = 0): void {
    const fragment = this.storyFlow.currentFragment();
    if (!fragment) {
      return;
    }

    if (fragment.kind === 'riddle') {
      this.storyFlow.submitRiddleAnswer(stepId);
      return;
    }

    this.storyFlow.goToFragment(stepId);
  }

  private mapFragmentToStep(fragment: Fragment | null): Step {
    if (!fragment) {
      return {
        id: '',
        title: '',
        description: '',
        choices: [],
      };
    }

    return {
      id: fragment.name,
      title: isDevMode() ? fragment.name : '',
      description: fragment.content,
      choices: this.mapFragmentChoices(fragment),
    };
  }

  private mapFragmentChoices(fragment: Fragment): Choice[] {
    if (fragment.kind === 'riddle') {
      const riddle = fragment.frontmatter as RiddleFrontmatter;
      return riddle.answers.map((answer) => ({
        id: answer.text,
        text: answer.text,
        nextStepId: answer.text,
      }));
    }

    if (fragment.kind === 'routing') {
      return [];
    }

    return fragment.outgoingChoices.map((choice) => ({
      id: choice.name,
      text: choice.label ?? 'Continuer',
      nextStepId: choice.name,
    }));
  }
}
