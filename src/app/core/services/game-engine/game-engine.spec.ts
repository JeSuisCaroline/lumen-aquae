import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { GameEngine } from './game-engine';

describe('GameEngine', () => {
  let service: GameEngine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEngine);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
