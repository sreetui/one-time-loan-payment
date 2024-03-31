import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { Payment, PaymentResponse } from '../state/model/payment';



@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  mockData: PaymentResponse = {
    confirmationNumber: `C${new Date().getTime()}`
  }
  makePayment(payment:Payment) {
    return of(this.mockData).pipe(delay(3000));
  }

}
