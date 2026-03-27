import {Component, inject} from '@angular/core';
import {GameService} from './core/services/game/game.service';
import {StepComponent} from './features/step/step.component';
import {PlayerComponent} from './features/player/player.component';
import {TitleComponent} from './shared/ui/title/title.component';

@Component({
  selector: 'lumen-root',
  standalone: true,
  imports: [StepComponent, PlayerComponent, TitleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameService = inject(GameService);
}
