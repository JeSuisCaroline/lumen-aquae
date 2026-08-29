import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {StepComponent} from '../step/step.component';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'lumen-game',
  standalone: true,
  imports: [CommonModule, HeaderComponent, StepComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {}
