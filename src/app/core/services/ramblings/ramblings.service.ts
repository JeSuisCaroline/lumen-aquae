import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, forkJoin, map, of, shareReplay } from 'rxjs';
import { type ResourceEffects } from '../../../shared/models/story-flow.model';
import { type Rambling, type RamblingImageManifest } from '../../../shared/models/rambling.model';
import { parseRamblingMarkdown } from './ramblings.parser';
import { toAssetUrl } from '../story-flow/story-flow.parser';

@Injectable({
  providedIn: 'root',
})
export class RamblingsService {
  private readonly http = inject(HttpClient);
  private readonly ramblingsFolder = ['data', 'DIVAGATIONS'];
  private readonly imagesFolder = ['divagations'];
  private readonly pendingIds = new Set<string>();

  private readonly ramblingsSignal = signal<Rambling[]>([]);
  private readonly unreadCountSignal = signal(0);

  // Chargé une fois, partagé entre tous les déblocages : associe un id de divagation
  // à une image/un crédit sans jamais toucher au contenu Obsidian (cf. CLAUDE.md).
  private readonly imageManifest$ = this.http.get<RamblingImageManifest>(this.manifestUrl()).pipe(
    catchError(() => of<RamblingImageManifest>({})),
    shareReplay(1),
  );

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

  // Restaure des divagations déjà débloquées lors d'une partie précédente (sauvegarde) :
  // contrairement à unlock(), ça ne compte jamais comme une nouvelle divagation non lue.
  public restore(ids: string[]): void {
    for (const id of ids) {
      this.fetchAndAdd(id, false);
    }
  }

  private unlock(id: string): void {
    this.fetchAndAdd(id, true);
  }

  private fetchAndAdd(id: string, countAsUnread: boolean): void {
    const alreadyKnown = this.ramblingsSignal().some((candidate) => candidate.id === id) || this.pendingIds.has(id);
    if (alreadyKnown) {
      return;
    }

    this.pendingIds.add(id);
    forkJoin([
      this.http.get(this.ramblingUrl(id), { responseType: 'text' }).pipe(map((raw) => parseRamblingMarkdown(raw, id))),
      this.imageManifest$,
    ]).subscribe({
      next: ([rambling, manifest]) => {
        this.pendingIds.delete(id);
        this.ramblingsSignal.update((list) => [...list, this.withImage(rambling, manifest[id])]);
        if (countAsUnread) {
          this.unreadCountSignal.update((count) => count + 1);
        }
      },
      error: (error) => {
        this.pendingIds.delete(id);
        console.error(`Divagation introuvable ou invalide pour l'id "${id}".`, error);
      },
    });
  }

  private withImage(rambling: Rambling, entry: RamblingImageManifest[string] | undefined): Rambling {
    if (!entry) {
      return rambling;
    }

    return {
      ...rambling,
      image: toAssetUrl(...this.imagesFolder, `${rambling.id}.${entry.ext ?? 'jpg'}`),
      imageCredit: entry.credit,
    };
  }

  private ramblingUrl(id: string): string {
    return toAssetUrl(...this.ramblingsFolder, `${id}.md`);
  }

  private manifestUrl(): string {
    return toAssetUrl(...this.imagesFolder, 'manifest.json');
  }
}
