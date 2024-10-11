import { AbstractControl } from "@angular/forms";

export function PasswordMatcher(password: string, passwordConfirm: string) {
    return (controls: AbstractControl) => {
        const control = controls.get(password);
        const matchingControl = controls.get(passwordConfirm);

        // Finish if another validator has already found an error on the matchingControl
        if (matchingControl?.errors && !matchingControl.errors['mustMatch']) return;

        // Set error on matchingControl if validation fails
        if (control?.value !== matchingControl?.value) {
            matchingControl?.setErrors({ mustMatch: true });
        } else {
            matchingControl?.setErrors(null);
        }
    }
}

