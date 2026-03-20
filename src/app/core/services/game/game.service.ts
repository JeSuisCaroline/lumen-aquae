import { Injectable } from '@angular/core';
import {SCENARIO} from '../../../data/scenario';
import {Step} from '../../../shared/models/game-step.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private steps: Step[] = SCENARIO;
  public currentStep: Step = this.steps[0];
  public gold: number = 0;

  public goToStep(stepId: string, goldBonus: number = 0) {
    const next: Step | undefined = this.steps.find((step: Step) => step.id === stepId);
    if (next) {
      this.currentStep = next;
      this.gold += goldBonus;
    }
  }

}
