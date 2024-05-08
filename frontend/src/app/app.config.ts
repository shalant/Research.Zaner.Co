import { ApplicationConfig } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { UsdaDataComponent } from './features/usda-data/usda-data.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
};


