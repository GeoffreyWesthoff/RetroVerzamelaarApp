import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { UserService } from '../user.service';
import { User, UserResponse } from '../user.schema';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  
  users: User[] = [];

  constructor(readonly authService: AuthenticationService, readonly userService: UserService, readonly router: Router) {}

  ngOnInit(): void {
      this.userService.getUsers().subscribe((resp) => {
        if (!this.authService.isAdmin()) {
          this.router.navigateByUrl('/');
        }
        this.users = resp})
     
  }


  delete(user: User) {
    this.userService.deleteAccountAdmin(user.username).subscribe((resp) => (this.users = this.users.filter((u) => (u!== user))))
  }
}
