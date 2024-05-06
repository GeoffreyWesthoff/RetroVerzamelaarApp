import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserResponse } from '../../user.schema';
import { AuthenticationService } from 'frontend/src/app/authentication.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

function passwordMatches(c: AbstractControl) {
  return c.get('password')?.value === c.get('password_confirm')?.value ? null: {'passwordMismatch': true};
}

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent implements OnInit {

  error = '';

  user: UserResponse = this.userService.user;

  
  manageUserForm: FormGroup = this.formBuilder.group(
    {
      username: ['', Validators.required],
      current_password: ['', Validators.required, Validators.min(8), Validators.max(64)],
      password: ['', ],
      password_confirm: ['', ]
    }
  )

  constructor(private readonly userService: UserService, private readonly formBuilder: FormBuilder, 
    private readonly authService: AuthenticationService,
    private readonly router: Router,
    private _route: ActivatedRoute
    ) {}

  ngOnInit(): void {
      this.userService.getUser(this._route.snapshot.params['username']).subscribe((resp => {
        this.userService.user = this.user = resp;
        if (!this.userService.user) {
          this.router.navigateByUrl('/')
        }
      }))

     
  }

  onSubmit() {
    if (this.authService.isAdmin()) {
      this.userService.editAccountAdmin(this._route.snapshot.params['username'], this.manageUserForm.value).subscribe((resp) => {this.router.navigateByUrl('/users')})
    } else {
    this.userService.editAccount(this.manageUserForm.value).subscribe(resp => {this.authService.logout();this.router.navigateByUrl('/') }, error => {this.error = error.error.message});
    }

  }

  deleteAccount() {
    if (this.authService.isAdmin()) {
      this.userService.deleteAccountAdmin(this._route.snapshot.params['username']).subscribe((resp) => (this.router.navigateByUrl('/users')))
    } else {
    this.userService.deleteAccount(this.manageUserForm.get('current_password')?.value).subscribe(resp => {this.authService.logout();this.router.navigateByUrl('/') }, error => {this.error = error.error.message});
    }
  }

}
