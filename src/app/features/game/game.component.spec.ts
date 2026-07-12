import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { GameComponent } from './game.component';
import { GameService } from '../../core/services/game/game.service';

describe('GameComponent', () => {
  let fixture: ComponentFixture<GameComponent>;
  let gameService: GameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    gameService = TestBed.inject(GameService);

    fixture = TestBed.createComponent(GameComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

