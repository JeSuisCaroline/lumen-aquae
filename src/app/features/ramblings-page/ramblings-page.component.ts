import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TitleComponent } from '../../shared/ui/title/title.component';
import { FlourishHeadingComponent } from '../../shared/ui/flourish-heading/flourish-heading.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { GameService } from '../../core/services/game/game.service';

@Component({
  selector: 'lumen-ramblings-page',
  standalone: true,
  imports: [TitleComponent, FlourishHeadingComponent, ButtonComponent],
  templateUrl: './ramblings-page.component.html',
  styleUrls: ['./ramblings-page.component.scss'],
})
export class RamblingsPageComponent {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  readonly ramblings = this.gameService.ramblingsList;

  constructor() {
    this.gameService.markRamblingsRead();
  }

  close(): void {
    this.router.navigateByUrl('/game');
  }
}