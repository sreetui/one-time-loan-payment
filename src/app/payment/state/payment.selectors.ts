import { paymentFeature } from "./payment.reducer";


const selectPaymentSuccess = paymentFeature.selectSuccess;
const selectPaymentFailure = paymentFeature.selectFailure;
const selectSuccessConfirmationNumber = paymentFeature.selectSuccessConfirmationNumber;

export const fromPayment = {
    selectPaymentSuccess,
    selectPaymentFailure,
    selectSuccessConfirmationNumber
};
