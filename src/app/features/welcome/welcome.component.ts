import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TitleComponent } from '../../shared/ui/title/title.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { GameSaveService } from '../../core/services/game-save/game-save.service';

@Component({
  selector: 'lumen-welcome',
  standalone: true,
  imports: [TitleComponent, ButtonComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  private readonly router = inject(Router);
  private readonly gameSave = inject(GameSaveService);

  readonly hasSave = this.gameSave.hasSave();

  startStory(): void {
    this.router.navigateByUrl('/game');
  }

  resumeStory(): void {
    this.router.navigateByUrl('/game');
  }

  startNewGame(): void {
    this.gameSave.clear();
    this.router.navigate(['/game'], { queryParams: { fresh: 'true' } });
  }

  openTuto(): void {
    this.router.navigateByUrl('/tuto');
  }
}
