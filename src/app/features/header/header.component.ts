import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { PlayerStatusComponent } from '../player-status/player-status.component';
import { FouIconComponent } from '../fou-icon/fou-icon.component';
import { GameService } from '../../core/services/game/game.service';

@Component({
  selector: 'lumen-header',
  standalone: true,
  imports: [ButtonComponent, PlayerStatusComponent, FouIconComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  readonly ramblingsCount = this.gameService.ramblingsCount;
  readonly hasNewRambling = this.gameService.hasUnreadRambling;
  readonly ramblingMessage = 'Divagation du Fou disponible !';

  // Ne réinitialise plus la partie : la sauvegarde se met déjà à jour à chaque fragment atteint
  // (cf. GameService), donc revenir à l'accueil laisse la progression intacte pour "Reprendre".
  // Le reset explicite se fait désormais uniquement via "Nouvelle partie" sur /welcome.
  onBackToWelcome(): void {
    this.router.navigateByUrl('/welcome');
  }

  onFouIconClick(): void {
    this.router.navigateByUrl('/ramblings');
  }
}