import { Component, Input, inject } from '@angular/core';
import { TitleComponent } from '../../shared/ui/title/title.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { PlayerStatusComponent } from '../player-status/player-status.component';
import { GameService } from '../../core/services/game/game.service';

@Component({
  selector: 'lumen-header',
  standalone: true,
  imports: [TitleComponent, ButtonComponent, PlayerStatusComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title = "Aix-en-Provence : Le Mystère";
  private readonly gameService = inject(GameService);

  onRestart(): void {
    this.gameService.restart();
  }
}