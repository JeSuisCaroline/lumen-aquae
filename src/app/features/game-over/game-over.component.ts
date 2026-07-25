import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TitleComponent } from '../../shared/ui/title/title.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { GameService } from '../../core/services/game/game.service';

@Component({
  selector: 'lumen-game-over',
  standalone: true,
  imports: [TitleComponent, ButtonComponent],
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
})
export class GameOverComponent {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  backToWelcome(): void {
    this.gameService.restart();
    this.router.navigateByUrl('/welcome');
  }
}
