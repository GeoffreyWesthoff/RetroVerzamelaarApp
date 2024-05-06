import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConsoleService } from './console.service';
import { Console } from './console.schema';
import { UserService } from '../user/user.service';
import { Collectable, UserResponse } from '../user/user.schema';
import { AuthenticationService } from '../authentication.service';
import { CollectModalComponent } from '../collect-modal/collect-modal.component';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css'],
})
export class ConsoleComponent implements OnInit {
  consoles: Console[] = this.consoleService.consoles;
  ready = false;

  @ViewChild('collectModal')
  collectModal!: CollectModalComponent;

  @ViewChild('searchBox') searchBox!: ElementRef;

  user: UserResponse = {
    _id: '',
    user: {
      admin: false,
      username: '',
      owned_consoles: [],
      owned_games: []
    },
    consoles: [],
    games: [],
    recommendations: []
  };

  constructor(private consoleService: ConsoleService, private userService: UserService, readonly authService: AuthenticationService) {}

  async ngOnInit(): Promise<void> {
    this.getConsoles();
    await this.userService.getUser(this.authService.getUsername()).subscribe((user) => {
      this.user = this.userService.user = user;
    });
    
  }

  search(): void {
    //@ts-ignore
    let input = this.searchBox.nativeElement.value;
    console.log(this.searchBox.nativeElement.value);
    if (input === null) {this.getConsoles()}
    this.consoleService.search(input).subscribe((games) => {this.consoles = this.consoleService.consoles = games})
  }


  getConsoles(): void {
    this.consoleService
      .getConsoles()
      .subscribe((consoles) => (this.consoles = this.consoleService.consoles = consoles));
  }

  delete(console: Console): void {
    this.consoles = this.consoles.filter((h) => h !== console);
    this.consoleService.deleteConsole(console.id).subscribe();
  }

  hasConsole(console_id: string): boolean {
    //@ts-ignore
    return this.user.user.owned_consoles.map((console) => (console.id)).includes(console_id);
  }

  collect(collectable: Console): void {
    this.userService.collect(collectable, 'console', {});
  }

  open(c: Console) {
    document.querySelector('body')?.classList.add('modal-open');
    document.querySelector('#collectModal')?.classList.add('fade', 'show');
    //@ts-ignore
    document.querySelector('#collectModal').style =' display: block; padding-right: 0px;'

    this.collectModal.collectable = c
    this.collectModal.type = 'console';
  }

  
}
