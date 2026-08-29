import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevFragmentSearchComponent } from './features/dev-fragment-search/dev-fragment-search.component';
import { AppUpdateService } from './core/services/app-update/app-update.service';

@Component({
  selector: 'lumen-root',
  standalone: true,
  imports: [RouterOutlet, DevFragmentSearchComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly appUpdate = inject(AppUpdateService);

  constructor() {
    this.appUpdate.listenForUpdates();
  }
}
