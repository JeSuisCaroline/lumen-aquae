import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TitleComponent } from '../../shared/ui/title/title.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'lumen-welcome',
  standalone: true,
  imports: [TitleComponent, ButtonComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  private readonly router = inject(Router);

  startStory(): void {
    this.router.navigateByUrl('/game');
  }

  openTuto(): void {
    this.router.navigateByUrl('/tuto');
  }
}
