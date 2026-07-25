import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevFragmentSearchComponent } from './features/dev-fragment-search/dev-fragment-search.component';

@Component({
  selector: 'lumen-root',
  standalone: true,
  imports: [RouterOutlet, DevFragmentSearchComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
