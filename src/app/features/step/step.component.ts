import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../core/services/game/game.service';
import { TitleComponent } from '../../shared/ui/title/title.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'lumen-step',
  standalone: true,
  imports: [CommonModule, TitleComponent, ButtonComponent],
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent {
  gameService = inject(GameService);
}

