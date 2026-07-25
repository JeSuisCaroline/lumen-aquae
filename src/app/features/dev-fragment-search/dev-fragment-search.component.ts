import { Component, computed, inject, isDevMode, signal } from '@angular/core';
import { GameService } from '../../core/services/game/game.service';

@Component({
  selector: 'lumen-dev-fragment-search',
  standalone: true,
  templateUrl: './dev-fragment-search.component.html',
  styleUrls: ['./dev-fragment-search.component.scss'],
})
export class DevFragmentSearchComponent {
  private readonly gameService = inject(GameService);

  readonly isDevMode = isDevMode();

  readonly query = signal('');
  readonly isOpen = signal(false);

  readonly suggestions = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) {
      return [];
    }

    return this.gameService
      .fragmentNames()
      .filter((name) => name.toLowerCase().includes(term))
      .slice(0, 10);
  });

  onInput(value: string): void {
    this.query.set(value);
    this.isOpen.set(true);
  }

  onFocus(): void {
    if (this.query().trim()) {
      this.isOpen.set(true);
    }
  }

  onBlur(): void {
    this.isOpen.set(false);
  }

  selectFragment(name: string): void {
    this.gameService.jumpToFragment(name);
    this.query.set('');
    this.isOpen.set(false);
  }
}
