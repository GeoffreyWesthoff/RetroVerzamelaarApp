import { Component, OnInit, ViewChild } from '@angular/core';
import {Console} from "../console/console.schema";
import {ConsoleService} from "../console/console.service";
import {ActivatedRoute} from "@angular/router";
import {parse, format} from "date-fns";
import { Game } from '../game/game.schema';
import { UserService } from '../user/user.service';
import { CollectModalComponent } from '../collect-modal/collect-modal.component';
import { Collectable } from '../user/user.schema';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-console-detail',
  templateUrl: './console-detail.component.html',
  styleUrls: ['./console-detail.component.css']
})
export class ConsoleDetailComponent implements OnInit {
  c: any = undefined;
  bestGames: Game[] = [];
  user: any = {}

  @ViewChild('collectModal')
  collectModal!: CollectModalComponent

  constructor(
    private userService: UserService,
    private consoleService: ConsoleService,
    private _route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getConsole();
    this.getBest();
    this.userService.getUser(this.authService.getUsername()).subscribe((user) => (this.user = user))
  }

  parseDate(date: string) {
    //@ts-ignore
    return parse(date, "uuuu-MM-d", new Date());
  }

  formatDate(date: string | Date) {
     if (date instanceof Date) {
      return format(date, 'PPP')
     }
      return format(this.parseDate(date), 'PPP')
  }

  getConsole(): void {
    this.consoleService
      .getConsole(this._route.snapshot.params['id'])
      .subscribe((c) => (this.c = c));
  }

  getBest(): void {
    this.consoleService
    .getBest(this._route.snapshot.params['id'])
    .subscribe((games) => (this.bestGames = games))
  }

  collectGame(collectable: Game): void {
    this.userService.collect(collectable, 'game', {});
  }


hasConsole(console_id: string): boolean {
  //@ts-ignore
  return this.user.user.owned_consoles.map((console) => (console.id)).includes(console_id);
}

collect(c: Console): void {
  this.userService.collect(c, 'console', {});
}

open(c: Console) {
  document.querySelector('body')?.classList.add('modal-open');
  document.querySelector('#collectModal')?.classList.add('fade', 'show');
  //@ts-ignore
  document.querySelector('#collectModal').style =' display: block; padding-right: 0px;'

  this.collectModal.collectable = c
  this.collectModal.type = 'console';
}

openGame(game: Game) {
  console.log(game);
  document.querySelector('body')?.classList.add('modal-open');
  document.querySelector('#collectModal')?.classList.add('fade', 'show');
  //@ts-ignore
  document.querySelector('#collectModal').style =' display: block; padding-right: 0px;'

  this.collectModal.collectable = game
  this.collectModal.type = 'game';
}

hasGame(game: Game): boolean {
  //@ts-ignore
  return this.user.user.owned_games.includes(game.id);
}
}
