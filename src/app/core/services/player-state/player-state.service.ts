import { Injectable, signal } from '@angular/core';
import { type ResourceEffects } from '../../../shared/models/story-flow.model';

const INITIAL_FLORINS = 10;
const INITIAL_HOPHOPHOPS = 10;
const INITIAL_SCORE = 0;

@Injectable({
  providedIn: 'root',
})
export class PlayerStateService {
  private readonly florinsSignal = signal(INITIAL_FLORINS);
  private readonly hophophopsSignal = signal(INITIAL_HOPHOPHOPS);
  private readonly scoreSignal = signal(INITIAL_SCORE);

  readonly florins = this.florinsSignal.asReadonly();
  readonly hophophops = this.hophophopsSignal.asReadonly();
  readonly score = this.scoreSignal.asReadonly();

  public applyEffects(effects: ResourceEffects | null | undefined): void {
    if (!effects) {
      return;
    }

    if (effects.FLO) {
      this.florinsSignal.update((value) => Math.max(0, value + effects.FLO!));
    }

    if (effects.HOP) {
      this.hophophopsSignal.update((value) => Math.max(0, value + effects.HOP!));
    }
  }

  public incrementScore(amount: number): void {
    this.scoreSignal.update((value) => value + amount);
  }

  public resetScore(): void {
    this.scoreSignal.set(INITIAL_SCORE);
  }

  public reset(): void {
    this.florinsSignal.set(INITIAL_FLORINS);
    this.hophophopsSignal.set(INITIAL_HOPHOPHOPS);
    this.resetScore();
  }
}
