import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";


export const numberPatternFunction = Validators.pattern('^[0-9]*$');
export const wordPatternFunction = Validators.pattern('^[a-zA-Z_]*$');
export const requiredValidator = Validators.required;
export const minLengthValidator = Validators.minLength;
export const maxLengthValidator = Validators.maxLength;

export function bankNumberConfirmBankNumberValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const [bankAccountNumber, confirmBankAccountNumber] = [control.get('bankAccountNumber')?.value, control.get('confirmBankAccountNumber')?.value]
    const valid = bankAccountNumber === confirmBankAccountNumber;
    return !valid ? of({ unmatched: true }) : of(null);
  };
}



