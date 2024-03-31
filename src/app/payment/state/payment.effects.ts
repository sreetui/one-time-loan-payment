import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { paymentActions } from './payment.actions';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { PaymentService } from '../services/payment.service';
import { PaymentResponse } from './model/payment';

@Injectable()
export class PaymentEffects {
  actions$ = inject(Actions); 
  paymentService = inject(PaymentService);
  makePayment = createEffect(()=>{
    return this.actions$.pipe(
      ofType(paymentActions.makePayment),
      switchMap((action)=>{
        return this.paymentService.makePayment(action.payment).pipe(
            map((response:PaymentResponse)=>{
                return paymentActions.makePaymentSuccess({response});
            }),
            catchError((error)=>{
                return of(paymentActions.makePaymentFailure(error.message));
            })
        )
      })
    )
  })

}
