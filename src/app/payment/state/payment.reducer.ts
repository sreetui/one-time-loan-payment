import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { Payment, PaymentResponse } from "./model/payment";
import { paymentActions } from "./payment.actions";

export interface PaymentReducer {
    payment: Payment | null;
    loading: Boolean | null;
    success: PaymentResponse | null;
    failure: string | null;
}

const initialState: PaymentReducer = {
    payment: null,
    loading: null,
    success: null,
    failure: null
};
export const paymentFeature = createFeature({
    name: "Payment",
    reducer: createReducer<PaymentReducer>(
        initialState,
        on(paymentActions.makePayment, (state, {})=>{
            return {
                ...state,
                success:null,
                failure: null,
                loading: true
            }
        }),
        on(paymentActions.makePaymentSuccess, (state, {response})=>{
            return {
                ...state,
                success:response,
                failure: null,
                loading: false
            }
        }),
        on(paymentActions.makePaymentFailure, (state, {error})=>{
            return {
                ...state,
                success:null,
                failure: error,
                loading: false
            }
        })
    ),
    extraSelectors:({selectSuccess})=>({
        selectSuccessConfirmationNumber: createSelector(selectSuccess, (success)=>{
            return success?.confirmationNumber;
        })
    })
}) 