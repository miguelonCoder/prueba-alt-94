import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { Datasource } from './services/datasource/datasource.interface';
import { HttpSourceService } from './services/datasource/httpsource';
import { PropertyService } from './services/property-service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    PropertyService,
    {
      provide: Datasource,
      useClass: HttpSourceService
    }
  ]
};
