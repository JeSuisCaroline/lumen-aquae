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

  it('should start a new SOLO game', () => {
    service.startNewGame();
    expect(service.mode).toBe('solo');
    expect(service.getCurrentStep('luce')).toBeTruthy();
    expect(service.getCurrentStep('escur')).toBeTruthy();
    expect(service.players.luce.gold).toBe(0);
    expect(service.players.escur.gold).toBe(0);
  });

  it("should let Luce's choice influence Escur's available choices", () => {
    service.startNewGame();

    // Au départ, Escur peut tenter le vol (merchantWarned = false)
    let escurChoices = service.getAvailableChoices('escur').map((c) => c.id);
    expect(escurChoices).toContain('E1_C1');

    // Luce prévient le marchand => merchantWarned = true
    service.pickChoice('luce', 'L1_C1');
    expect(service.sharedFlags['merchantWarned']).toBe(true);

    // Escur ne doit plus voir le choix E1_C1 (requires !merchantWarned)
    escurChoices = service.getAvailableChoices('escur').map((c) => c.id);
    expect(escurChoices).not.toContain('E1_C1');
    expect(escurChoices).toContain('E1_C1_LOCKED');
  });

  it('should auto-play Escur in SOLO mode', () => {
    service.startNewGame();
    expect(service.mode).toBe('solo');
    // Escur joue automatiquement, donc il ne reste pas sur E1.
    expect(service.players.escur.currentStepId).not.toBe('E1');
    // Il devrait avoir déclenché au moins un flag.
    expect(Object.keys(service.sharedFlags).length).toBeGreaterThan(0);
  });
});
