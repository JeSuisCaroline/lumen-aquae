import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with first step', () => {
    expect(service.currentStep).toBeTruthy();
  });

  it('should initialize gold to 0', () => {
    expect(service.gold).toBe(0);
  });

  it('should navigate to step and add gold', () => {
    const initialGold = service.gold;

    if (service.currentStep?.choices && service.currentStep.choices.length > 0) {
      const choice = service.currentStep.choices[0];
      service.goToStep(choice.nextStepId, 10);
      expect(service.gold).toBe(initialGold + 10);
    }
  });
});
