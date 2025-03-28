import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { GoogleAnalyticsService } from './app/services/google-analytics.service';
import { FacebookEventService } from './app/services/facebook-events.service';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(),provideRouter(routes), provideClientHydration(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),GoogleAnalyticsService, FacebookEventService
        ]
})
.catch(err => console.error(err));
