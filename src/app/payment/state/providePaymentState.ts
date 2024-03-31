import { provideState } from "@ngrx/store";
import { paymentFeature } from "./payment.reducer";
import { provideEffects } from "@ngrx/effects";
import { PaymentEffects } from "./payment.effects";
import { EnvironmentProviders } from "@angular/core";

export const providePaymentStateConfig:EnvironmentProviders[] = [ provideState(paymentFeature), provideEffects(PaymentEffects)];