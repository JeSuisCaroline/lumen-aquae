import { Component, computed, inject } from '@angular/core';
import { GameService } from '../../core/services/game/game.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'lumen-player-status',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './player-status.component.html',
  styleUrls: ['./player-status.component.scss'],
})
export class PlayerStatusComponent {
  private readonly gameService = inject(GameService);

  readonly florins = this.gameService.florins;
  readonly hopopops = this.gameService.hopopops;
  readonly isLowHopopops = computed(() => this.hopopops() > 0 && this.hopopops() <= 3);
}
