import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoanRepaymentErrorHandler implements ErrorHandler {
  handleError(error: any) {
    console.error(error);
  }
}
