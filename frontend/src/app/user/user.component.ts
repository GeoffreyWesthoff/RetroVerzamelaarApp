import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './user.service';
import { Collectable, UserResponse } from './user.schema';
import { Game } from '../game/game.schema';
import { Console } from '../console/console.schema';
import { ConsoleService } from '../console/console.service';
import { CollectModalComponent } from '../collect-modal/collect-modal.component';
import { log } from 'console';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  ready = false;

  user: UserResponse = this.userService.user;

  totalConsoleCost = 0;
  totalConsoleValue = 0;

  totalGameCost = 0;
  totalGameValue = 0;

  @ViewChild('collectModal') collectModal !: CollectModalComponent;
  

  constructor(private userService: UserService, private consoleService: ConsoleService, private _route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit() {
    this.getUser();
    this.consoleService.getConsoles().subscribe((consoles) => (this.consoleService.consoles = consoles))
    
  }
    

    uncollectGame(collectable: Collectable): void {
      this.userService.uncollect(collectable, 'game');
  }
  
    uncollectConsole(c: Collectable): void {
      this.userService.uncollect(c, 'console');
  }
  
  getUser() {
    this.userService.getUser(this._route.snapshot.params['username']).subscribe((user) => {
      this.user = this.userService.user = user;
      this.totalConsoleCost = Math.round(this.user.user.owned_consoles.map((console) => (Number(console.purchase_price))).reduce((x, y) => (x + y)));
      this.totalConsoleValue = Math.round(this.user.consoles.map((console) => (Number(console.market_price))).reduce((x, y) => (x + y)));

      this.totalGameCost = Math.round(this.user.user.owned_games.map((game) => (Number(game.purchase_price))).reduce((x, y) => (x + y)));
      this.totalGameValue = Math.round(this.user.games.map((game) => (Number(game.market_price))).reduce((x, y) => (x + y)));
    
    });
  }

  isMe() {
    return this._route.snapshot.params['username'] === this.authService.getUsername()
  }

  getConsole(console_id: string): Console {
    return this.user.consoles.filter((console) => (console.id == console_id))[0];
  }

  getGame(game_id: string): Game {
    const game = this.user.games.filter((game) => (game.id == game_id))[0];
    return game;
  }


  getForConsole(console_id: string | undefined): Console  {
    let c = {name: "Unknown", "id": "0", "image_url": "", release_date: new Date(), max_controllers: 1, market_price: 0, online_capable: true};
    if (console_id === undefined) {
      return c
    }
     c = this.consoleService.consoles.filter((gameConsole) => (gameConsole.id == console_id))[0]
     return c;
  }

  open(game: Game) {
    document.querySelector('body')?.classList.add('modal-open');
    document.querySelector('#collectModal')?.classList.add('fade', 'show');
    //@ts-ignore
    document.querySelector('#collectModal').style =' display: block; padding-right: 0px;'

    this.collectModal.collectable = game
    this.collectModal.type = 'game';
  }
    
}
