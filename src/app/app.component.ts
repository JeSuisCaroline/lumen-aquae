import {Component, inject} from '@angular/core';
import {GameService} from './core/services/game/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameService = inject(GameService);
}
