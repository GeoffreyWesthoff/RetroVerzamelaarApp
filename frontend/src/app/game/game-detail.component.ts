import { Component, ViewChild } from '@angular/core';
import { GameService } from './game.service';
import {parse, format} from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { GameResponse } from './gameResponse.schema';
import { Game } from './game.schema';
import { UserService } from '../user/user.service';
import { Collectable, UserResponse } from '../user/user.schema';
import { CollectModalComponent } from '../collect-modal/collect-modal.component';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css',
})
export class GameDetailComponent {
  gameResponse: any;
  consoles: any;
  game: any;
  companies: any;

  user: UserResponse = this.userService.user;

  @ViewChild('collectModal') collectModal !: CollectModalComponent;
  

  constructor(
    private gameService: GameService,
    private userService: UserService,
    private _route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getGame();
    this.userService.getUser(this.authService.getUsername()).subscribe((user) => {
      this.user = this.userService.user = user;
    });
    }

  parseDate(date: string) {
    console.log(date)
    return parse(date, "d-MM-uuuu", new Date());
  }

  formatDate(date: string) {
      return format(this.parseDate(date), 'PPP')
  }

  getGame(): void {
    this.gameService
      .getGame(this._route.snapshot.params['id'])
      .subscribe((gameResponse) => {
        this.gameResponse = gameResponse;
        this.game = gameResponse.game;
        this.consoles = gameResponse.consoles;
        this.companies = gameResponse.companies;
      });
  }

  collect(collectable: Game): void {
    this.userService.collect(collectable, 'game', {});
  }

  hasGame(game_id: string): boolean {
    
    return this.user.user.owned_games.map((game) => (game.id)).includes(game_id);
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
