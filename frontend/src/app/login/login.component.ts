import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  error: string = '';

  loginForm: FormGroup = this.formBuilder.group(
    {
      username: ['', Validators.required],
      password: ['', Validators.required]
    }
  )

  ngOnInit(): void {
  }

  constructor (private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) {}

  onSubmit(): void {
    let username = this.loginForm.get('username')?.value;
    let password = this.loginForm.get('password')?.value;
    if (!password || !username) {
      this.loginForm.markAllAsTouched();
      this.loginForm.get('username')?.markAsDirty();
      this.loginForm.get('password')?.markAsDirty();
      this.loginForm.updateValueAndValidity();
      return;
    }
    this.authenticationService.login(username, password).pipe(
      tap((resp: any) => {
        
      })
    ).subscribe(resp => {
      localStorage.setItem('token', resp.token);
      this.router.navigateByUrl(`/user/${username}`)}, error => {
      this.error = error.error.message;
    });
  }

}
