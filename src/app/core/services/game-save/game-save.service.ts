import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type GameSaveData } from '../../../shared/models/game-save.model';

const STORAGE_KEY = 'lumen-aquae:save';

// Les routes sont prérendues côté serveur (cf. app.routes.server.ts, RenderMode.Prerender) :
// localStorage n'existe pas dans ce contexte Node, d'où ce garde-fou sur isPlatformBrowser.
@Injectable({
  providedIn: 'root',
})
export class GameSaveService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public hasSave(): boolean {
    return this.load() !== null;
  }

  public load(): GameSaveData | null {
    if (!this.isBrowser) {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as GameSaveData;
    } catch {
      return null;
    }
  }

  public save(data: GameSaveData): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  public clear(): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }
}
