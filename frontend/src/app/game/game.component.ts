import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { Game } from './game.schema';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '../authentication.service';
import { Collectable, UserResponse } from '../user/user.schema';
import { CollectModalComponent } from '../collect-modal/collect-modal.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  games: Game[] = this.gameService.games;
  user: UserResponse = this.userService.user;
  
  @ViewChild('searchBox') searchBox!: ElementRef;

  @ViewChild('collectModal') collectModal !: CollectModalComponent;

  constructor(private gameService: GameService, readonly userService: UserService, readonly authService: AuthenticationService) {}

  ngOnInit(): void {
    this.getGames();
    this.userService.getUser(this.authService.getUsername()).subscribe((user) => {
      this.user = this.userService.user = user;
    });
  }

  getGames(): void {
    this.gameService
      .getGames()
      .subscribe((games) => (this.games = this.gameService.games = games));
  }

  delete(game: Game): void {
    this.games = this.games.filter((h) => h !== game);
    this.gameService.deleteGame(game.id).subscribe();
  }

  collect(collectable: Game): void {
    this.userService.collect(collectable, 'game', {});
  }


  search(): void {
    //@ts-ignore
    let input = this.searchBox.nativeElement.value;
    console.log(this.searchBox.nativeElement.value);
    if (input === null) {this.getGames()}
    this.gameService.search(input).subscribe((games) => {this.games = this.gameService.games = games})
  }

  hasGame(game_id: string): boolean {
    
    return this.user.user.owned_games.map((game) => (game.id)).includes(game_id);
  }

  open(game: Game) {
    console.log(game);
    document.querySelector('body')?.classList.add('modal-open');
    document.querySelector('#collectModal')?.classList.add('fade', 'show');
    //@ts-ignore
    document.querySelector('#collectModal').style =' display: block; padding-right: 0px;'

    this.collectModal.collectable = game
    this.collectModal.type = 'game';
  }

}
