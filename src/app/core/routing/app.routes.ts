import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  {
	path: 'welcome',
	loadComponent: () => import('../../features/welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
  {
	path: 'tuto',
	loadComponent: () => import('../../features/tuto/tuto.component').then((m) => m.TutoComponent),
  },
  {
	path: 'game',
	loadComponent: () => import('../../features/game/game.component').then((m) => m.GameComponent),
  },
  { path: '**', redirectTo: 'welcome' },
];
