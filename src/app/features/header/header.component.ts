import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { PlayerStatusComponent } from '../player-status/player-status.component';
import { GameService } from '../../core/services/game/game.service';

@Component({
  selector: 'lumen-header',
  standalone: true,
  imports: [ButtonComponent, PlayerStatusComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  onRestart(): void {
    this.gameService.restart();
    this.router.navigateByUrl('/welcome');
  }
}