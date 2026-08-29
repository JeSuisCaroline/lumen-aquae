import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StepComponent} from '../step/step.component';
import {HeaderComponent} from '../header/header.component';
import {GameService} from '../../core/services/game/game.service';

@Component({
  selector: 'lumen-game',
  standalone: true,
  imports: [CommonModule, HeaderComponent, StepComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  constructor() {
    const route = inject(ActivatedRoute);
    const gameService = inject(GameService);

    if (route.snapshot.queryParamMap.has('fresh')) {
      gameService.forceNewGame();
    }
  }
}
