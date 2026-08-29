import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { type ResourceEffects } from '../../../shared/models/story-flow.model';
import { type Rambling } from '../../../shared/models/rambling.model';
import { parseRamblingMarkdown } from './ramblings.parser';
import { toAssetUrl } from '../story-flow/story-flow.parser';

@Injectable({
  providedIn: 'root',
})
export class RamblingsService {
  private readonly http = inject(HttpClient);
  private readonly ramblingsFolder = ['data', 'DIVAGATIONS'];
  private readonly pendingIds = new Set<string>();

  private readonly ramblingsSignal = signal<Rambling[]>([]);
  private readonly unreadCountSignal = signal(0);

  readonly ramblings = this.ramblingsSignal.asReadonly();
  readonly totalCount = computed(() => this.ramblings().length);
  readonly hasUnread = computed(() => this.unreadCountSignal() > 0);

  public applyEffects(effects: ResourceEffects | null | undefined): void {
    if (effects?.RAMBLING) {
      this.unlock(effects.RAMBLING);
    }
  }

  public markAllRead(): void {
    this.unreadCountSignal.set(0);
  }

  public reset(): void {
    this.ramblingsSignal.set([]);
    this.unreadCountSignal.set(0);
    this.pendingIds.clear();
  }

  private unlock(id: string): void {
    const alreadyKnown = this.ramblingsSignal().some((candidate) => candidate.id === id) || this.pendingIds.has(id);
    if (alreadyKnown) {
      return;
    }

    this.pendingIds.add(id);
    this.http
      .get(this.ramblingUrl(id), { responseType: 'text' })
      .pipe(map((raw) => parseRamblingMarkdown(raw, id)))
      .subscribe({
        next: (rambling) => {
          this.pendingIds.delete(id);
          this.ramblingsSignal.update((list) => [...list, rambling]);
          this.unreadCountSignal.update((count) => count + 1);
        },
        error: (error) => {
          this.pendingIds.delete(id);
          console.error(`Divagation introuvable ou invalide pour l'id "${id}".`, error);
        },
      });
  }

  private ramblingUrl(id: string): string {
    return toAssetUrl(...this.ramblingsFolder, `${id}.md`);
  }
}