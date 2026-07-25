import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'lumen-tuto',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.scss'],
})
export class TutoComponent {
  private readonly router = inject(Router);

  backToWelcome(): void {
    this.router.navigateByUrl('/welcome');
  }
}
