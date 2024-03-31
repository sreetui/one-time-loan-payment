import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Payment, PaymentResponse } from "./model/payment";


export const paymentActions = createActionGroup({
    source:"Payment API",
    events:{
        "make payment": props<{payment: Payment}>(),
        "make payment success": props<{response:PaymentResponse}>(),
        "make payment failure": props<{error:string}>()
    }
})