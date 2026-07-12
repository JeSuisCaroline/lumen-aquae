import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  {
	path: 'game',
	loadComponent: () => import('../../features/game/game.component').then((m) => m.GameComponent),
  },
  { path: '**', redirectTo: 'game' },
];
