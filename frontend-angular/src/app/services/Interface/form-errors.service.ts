import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormErrorsService {

  constructor() { }

  fieldRequired(form: FormGroup, field: string) {
    const errors = form.get(field)?.errors
    if (errors?.['required']) return 'Field is required';
    return ''
  }

  fullNameErr(form: FormGroup) : string {
    const errors = form.get('fullName')?.errors;
    if (errors?.['required']) return 'Field is required';
    if (errors?.['minlength']) return 'Minium length is 6 characters';
    return '';
  }

  emailErr(form: FormGroup) : string {
    const errors = form.get('email')?.errors;
    if (errors?.['required']) return 'Field is required';
    if (errors?.['email']) return 'Invalid email format';
    return '';
  }

  passwordErr(form: FormGroup): string {
    const errors = form.get('password')?.errors;
    if (errors?.['required']) return 'Field is required';
    if (errors?.['minlength']) return 'Minium password length is 8 characters';
    return '';
  }

  confirmPassworddErr(form: FormGroup): string {
    const errors = form.get('password2')?.errors;
    if (errors?.['required']) return 'Field is required';
    if (errors?.['minlength']) return 'Minium password length is 8 characters';
    if (errors?.['mustMatch']) return 'Passwords doesn\'t match';
    return '';
  }

  institutionErr(form: FormGroup): string {
    const errors = form.get('institution')?.errors;
    if (errors?.['required']) return 'Field is required';
    if (errors?.['minlength']) return 'Minium password length is 5 characters';
    return '';
  }

  xmlFileErr(form: FormGroup): string {
    const errors = form.get('xmlFile')?.errors;
    if (errors?.['required']) return 'Field is required';
    if (errors?.['minlength']) return 'Minium file length is 50 characters';
    return '';
  }

  ipErr(form: FormGroup): string {
    const errors = form.get('abmIp')?.errors;
    if (errors?.['pattern']) return 'Invalid IP format';
    return '';
  }

  tokenErr(form: FormGroup) : string {
    const errors = form.get('token')?.errors;
    if (errors?.['required']) return 'Field is required';
    if (errors?.['pattern']) return 'Invalid token format';
    return '';
  }

}
