import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { withInMemoryScrolling } from '@angular/router';

const serverConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
