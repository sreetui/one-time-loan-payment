import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { paymentActions } from "./payment.actions";
import { Payment } from "./model/payment";
import { paymentFeature } from "./payment.reducer";

@Injectable({
    providedIn:"root"
})

export class PaymentFacade{
    private store = inject(Store);
    paymentSuccess$ = this.store.select(paymentFeature.selectSuccess);
    successConfirmation$ = this.store.select(paymentFeature.selectSuccessConfirmationNumber);

    makePayment(payment:{payment: Payment}){
        this.store.dispatch(paymentActions.makePayment(payment));
    }
}