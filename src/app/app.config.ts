import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { providePaymentStateConfig } from './payment/state/providePaymentState';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideStore(),
  providePaymentStateConfig
  ]
};
