import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './core/routing/app.routes';
import { provideServiceWorker } from '@angular/service-worker'; // <--- 1. Ajoute l'import

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 2. Ajoute ce bloc dans le tableau des providers :
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
