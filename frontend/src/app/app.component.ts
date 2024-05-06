import { Component, OnInit } from '@angular/core';
import { UserService } from './user/user.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RetroVerzamelaar';

  constructor(readonly authService: AuthenticationService, private userService: UserService, private readonly router: Router) {}

  ngOnInit() {
    this.getMe()
  }

  getMe(): void {
    this.userService
      .getUser(this.authService.getUsername())
      .subscribe((user) => (this.userService.user = user));
  }

  logOut() {
    this.authService.logout();
    //@ts-ignore
    this.userService.user = undefined;
    this.router.navigateByUrl('/')
  }
}
