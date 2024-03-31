

export interface Payment {
    loanAccountNumber: string;
    accountType:string;
    cardNumber?: string;
    name?: string;
    expirationDate?: string;
    cvv?: string;
    routingNumber?: string;
    bankAccountNumber?: string;
}

export interface PaymentResponse{
    confirmationNumber: string;
}