import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  const canvasUrl = "/data/Canvas%20from%2012%2007%2026/L'histoire.canvas";
  const fragmentUrl = (name: string) => `/data/FRAGMENTS/${encodeURIComponent(name)}.md`;

  const canvasResponse = {
    nodes: [
      { id: 'n1', type: 'text', text: '[[Start]]', x: 0, y: 0, width: 100, height: 60 },
      { id: 'n2', type: 'text', text: '[[RIDDLE_Test]]', x: 0, y: 100, width: 100, height: 60 },
      { id: 'n3', type: 'text', text: '[[Test_OK]]', x: 0, y: 200, width: 100, height: 60 },
      { id: 'n4', type: 'text', text: '[[Test_KO]]', x: 0, y: 300, width: 100, height: 60 },
    ],
    edges: [
      { id: 'e1', fromNode: 'n1', fromSide: 'bottom', toNode: 'n2', toSide: 'top' },
      { id: 'e2', fromNode: 'n2', fromSide: 'bottom', toNode: 'n3', toSide: 'top' },
      { id: 'e3', fromNode: 'n2', fromSide: 'bottom', toNode: 'n4', toSide: 'top' },
    ],
  };

  const riddleFragment = `
---
{
  "type": "riddle",
  "question": "Quelle est la bonne réponse ?",
  "answers": [
    { "text": "Bonne réponse", "destination": "Test_OK", "increment": 1 },
    { "text": "Mauvaise réponse", "destination": "Test_KO", "increment": 0 }
  ]
}
---
Question`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);

    httpMock.expectOne(canvasUrl).flush(canvasResponse);
    httpMock.expectOne(fragmentUrl('Start')).flush('Bienvenue.');
    httpMock.expectOne(fragmentUrl('RIDDLE_Test')).flush(riddleFragment);
    httpMock.expectOne(fragmentUrl('Test_OK')).flush('Bonne route.');
    httpMock.expectOne(fragmentUrl('Test_KO')).flush('Mauvaise route.');
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created and expose the first fragment as the current step', () => {
    expect(service).toBeTruthy();
    expect(service.isReady()).toBe(true);
    expect(service.currentStep().id).toBe('Start');
    expect(service.florins()).toBe(10);
    expect(service.hopopops()).toBe(10);
  });

  it('should navigate to a standard fragment', () => {
    service.goToStep('RIDDLE_Test');
    expect(service.currentStep().id).toBe('RIDDLE_Test');
  });

  it('should route to the _OK fragment on a valid riddle answer, without affecting florins/hopopops', () => {
    service.goToStep('RIDDLE_Test');
    service.goToStep('Bonne réponse');

    expect(service.currentStep().id).toBe('Test_OK');
    expect(service.florins()).toBe(10);
    expect(service.hopopops()).toBe(10);
  });

  it('should route to the _KO fragment on an invalid riddle answer', () => {
    service.goToStep('RIDDLE_Test');
    service.goToStep('Mauvaise réponse');

    expect(service.currentStep().id).toBe('Test_KO');
  });
});
