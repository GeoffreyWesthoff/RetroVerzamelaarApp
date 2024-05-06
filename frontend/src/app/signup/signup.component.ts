import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

function passwordMatches(c: AbstractControl) {
  return c.get('password')?.value === c.get('password_confirm')?.value ? null: {'passwordMismatch': true};
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  error = '';

  signupForm: FormGroup = this.formBuilder.group(
    {
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(8), Validators.max(64)]],
      password_confirm: ['', [Validators.required, Validators.min(8), Validators.max(64)]]
    }, {validators: [passwordMatches]}
  )

  ngOnInit(): void {
  }

  constructor (private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) {}

  onSubmit(): void {
    let username = this.signupForm.get('username')?.value;
    let password = this.signupForm.get('password')?.value;
    let password_confirm = this.signupForm.get('password_confirm')?.value;
    if (!username) {
      this.signupForm.markAllAsTouched();
      this.signupForm.get('username')?.markAsDirty();
      this.signupForm.get('password')?.markAsDirty();
      this.signupForm.get('password_confirm')?.markAsDirty();
      this.signupForm.updateValueAndValidity();
      return;
    }
    if (!password) {
      this.signupForm.markAllAsTouched();
      this.signupForm.get('username')?.markAsDirty();
      this.signupForm.get('password')?.markAsDirty();
      this.signupForm.get('password_confirm')?.markAsDirty();
      this.signupForm.updateValueAndValidity();
      return;
    }
    if (password.length < 8 || password.length > 64 || password_confirm.length < 8 || password_confirm.length > 64) {
      this.signupForm.markAllAsTouched();
      this.signupForm.get('username')?.markAsDirty();
      this.signupForm.get('password')?.markAsDirty();
      this.signupForm.get('password_confirm')?.markAsDirty();
      this.signupForm.updateValueAndValidity();
      return;
    }
    if (password === password_confirm) {
      this.authenticationService.signup(username, password, password_confirm).subscribe(resp => (this.router.navigateByUrl('/login')), error => {
        this.error = error.error.message;
      });
    }
    
  }

  
}
