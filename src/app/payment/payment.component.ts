import { AsyncPipe, JsonPipe, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { bankNumberConfirmBankNumberValidator, numberPatternFunction, wordPatternFunction } from './services/payment-validators.service';
import { PaymentFacade } from './state/payment.facade';
import { Payment, PaymentResponse } from './state/model/payment';
import { BehaviorSubject, Subject, count } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, NgOptimizedImage, JsonPipe, AsyncPipe, SpinnerComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {

  paymentFacade = inject(PaymentFacade);
  processingPayment = new BehaviorSubject<boolean>(false);
  matDialog = inject(MatDialog);
  readonly DEBIT_TYPE = "Debit";
  readonly CHECKING_TYPE = "Checking";
  readonly STYLE:{[key:string]: any} = {'width': '3rem', 'height': '3rem'};
  readonly NUMBER_PATTERN = "^[0-9]*$";
  readonly STRING_PATTERN = "^[a-zA-Z_]*$";
  
  readonly currentDate = signal(new Date());
  expirationDateMin: Signal<string> = computed(() => {
    const year = this.currentDate().getFullYear();
    // increment month by 1 as it starts from 0
    let monthN = (this.currentDate().getMonth()) + 1;
    let month:string = `${monthN}`;
    if(monthN < 10){
      month = `0${month}`;
    }
    return `${year}-${month}`;
  });

  paymentFB = inject(FormBuilder);
  paymentForm = this.paymentFB.group({
    loanAccountNumber: ['', [Validators.required, numberPatternFunction, Validators.minLength(14)]],
    accountType: [this.CHECKING_TYPE],
    debitTypeInfo: this.paymentFB.group({
      cardNumber: ['', [Validators.required, numberPatternFunction, Validators.minLength(16)]],
      name: ['', [Validators.required, wordPatternFunction, Validators.minLength(3), Validators.maxLength(50)]],
      expirationDate: ['', [Validators.required]],
      cvv: ['', [Validators.required, numberPatternFunction, Validators.minLength(3)]]
    }),
    checkingTypeInfo: this.paymentFB.group({
      routingNumber: ['', [Validators.required, numberPatternFunction, Validators.minLength(9)]],
      bankAccountNumber: ['', [Validators.required, numberPatternFunction, Validators.minLength(12)]],
      confirmBankAccountNumber: ['', [Validators.required, numberPatternFunction]],
    },{
      asyncValidators: [bankNumberConfirmBankNumberValidator()]
    })
  })

  ngOnInit(): void {
    this.paymentFacade.successConfirmation$.subscribe((confirmationNumber) => {
      if (confirmationNumber) {
        this.onSuccessfulPayment(confirmationNumber);
      }
    })
  }

  get isDebit() {
    return this.paymentForm.get('accountType')?.value === this.DEBIT_TYPE;
  }
  get isChecking() {
    return this.paymentForm.get('accountType')?.value === this.CHECKING_TYPE;
  }
  get loanAccountNumber() {
    return this.paymentForm.get("loanAccountNumber")!;
  }
  get checkingTypeInfo() {
    return this.paymentForm.get('checkingTypeInfo')!
  }
  get routingNumber() {
    return this.checkingTypeInfo.get('routingNumber')!;
  }
  get bankAccountNumber() {
    return this.checkingTypeInfo.get('bankAccountNumber')!;
  }
  get confirmBankAccountNumber() {
    return this.checkingTypeInfo.get('confirmBankAccountNumber')!;
  }

  get debitTypeInfo() {
    return this.paymentForm.get('debitTypeInfo')!
  }
  get cardNumber() {
    return this.debitTypeInfo.get('cardNumber')!;
  }
  get name() {
    return this.debitTypeInfo.get('name')!;
  }
  get expirationDate() {
    return this.debitTypeInfo.get('expirationDate')!;
  }
  get cvv() {
    return this.debitTypeInfo.get('cvv')!;
  }
  get disableSubmit() {
    const validChecking = this.isChecking ? this.checkingTypeInfo.valid : true;
    const validDebit = this.isDebit ? this.debitTypeInfo.valid : true;
    let invalidForm = !(this.loanAccountNumber.valid && validChecking && validDebit);
    return invalidForm || this.processingPayment.getValue();
  }

  getFormData() {
    let formData: Payment = {
      loanAccountNumber: this.loanAccountNumber.value!,
      accountType: (this.isDebit ? this.DEBIT_TYPE : this.CHECKING_TYPE)
    };
    if (this.isDebit) {
      formData.cardNumber = this.cardNumber.value!;
      formData.name = this.name.value!;
      formData.expirationDate = this.expirationDate.value!;
      formData.cvv = this.cvv.value!;
    } else if (this.isChecking) {
      formData.routingNumber = this.routingNumber.value!
      formData.bankAccountNumber = this.bankAccountNumber.value!;
    }
    return formData;
  }

  validateNumber(event: { keyCode: any; }) {
    const keyCode = event.keyCode;
    return (keyCode > 31 && (keyCode < 48 || keyCode > 57)) ? false : true
  }
  validateString(event: { keyCode: any; }) {
    const keyCode = event.keyCode;
    return (keyCode > 64 && keyCode < 91) || (keyCode > 96 && keyCode < 123);
  }

  makePayment() {
    this.processingPayment.next(true);
    this.paymentFacade.makePayment({ payment: this.getFormData() });
  }
  resetForm() {
    this.paymentForm.reset({
      loanAccountNumber: '',
      accountType: this.CHECKING_TYPE,
      checkingTypeInfo: {
        routingNumber: '',
        bankAccountNumber: '',
        confirmBankAccountNumber: ''
      },
      debitTypeInfo: {
        cardNumber: '',
        name: '',
        expirationDate: '',
        cvv: ''
      }
    })
  }
  onSuccessfulPayment(confirmationNumber: string) {
    this.processingPayment.next(false);
    const enterAnimationDuration = "500ms";
    const exitAnimationDuration = "500ms";
    const openDialog = this.matDialog.open(DialogComponent, {
      width: '25rem',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Confirmaion',
        content: `Payment is successful. Conf #${confirmationNumber}`
      }
    });
    openDialog.afterClosed().subscribe((data) => {
      this.resetForm();
    });
  }
}
