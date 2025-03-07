import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideServiceWorker('ngsw-worker.js', {
    enabled: true, // Make sure the service worker is enabled
    registrationStrategy: 'registerWhenStable:3000' // Registers SW after 3s of app stability
  })]
};
