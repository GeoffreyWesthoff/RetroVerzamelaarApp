import { Component, OnInit } from '@angular/core';
import { Company } from '../../company/company.schema';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../company/company.service';
import { ConsoleService } from '../../console/console.service';
import { Console } from '../../console/console.schema';
import { Game } from '../game.schema';
import { GameService } from '../game.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrl: './game-edit.component.css'
})
export class GameEditComponent implements OnInit {
  consoles: Console[] = [];
  selectedConsoles: Console[] = [];

  companies: Company[] = [];
  selectedCompanies: Company[] = [];

  game: any = {};

  gameForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
      release_date: ['', [Validators.required]],
      market_price: [null, [Validators.required]],
      image_url: ['', [Validators.required, Validators.pattern(/^(http|https):\/\//i)]],
      max_players: ['', Validators.required],
      online_support: ['', [Validators.required, Validators.pattern('^(true|false)$' )]],
      region: ['', Validators.required],
      rating: ['', Validators.required],
      genre: ['', Validators.required],
      released_on: ['', Validators.required],
      developed_by: ['', Validators.required]
  }, {validators: []}
  )

  

constructor(private readonly companyService: CompanyService,
   private _route: ActivatedRoute,
    private readonly gameService: GameService,
     private readonly router: Router,
      private readonly consoleService: ConsoleService,
      private readonly formBuilder: FormBuilder) {}

ngOnInit(): void {
  this.getGame();
  console.log
}

getGame(): void {
  this.gameService
    .getGame(this._route.snapshot.params['id'])
    .subscribe((game) => (this.game = game.game, this.selectedConsoles = game.consoles, this.selectedCompanies = game.companies));
}  

onClickSubmit() {

  if (!this.gameForm.valid) {
    this.gameForm.markAllAsTouched();
    for (let control of Object.keys(this.gameForm.controls)) {
      this.gameForm.controls[control].markAsDirty();
    }
    return;
  }


    let gameIndex: number = 0;
    this.gameService.games.forEach((n: Game) => {
      if (n.id == this.game.id) {
        gameIndex = this.gameService.games.indexOf(n)
      }

    });

    const form = {...this.gameForm.value, released_on: this.selectedConsoles.map((console) => (console.id)), developed_by: this.selectedCompanies.map((company) => (company.id))}
    const newGame = this.gameService.editGame(this._route.snapshot.params['id'], form).subscribe((editedGame) => (this.gameService.games[gameIndex] = editedGame));
    this.router.navigate(['/game'])
  }

  searchConsoles(event: any) {
    this.consoleService.search(event.query).subscribe((consoles) => (
      this.consoles = consoles
    ));
  }

  searchCompanies(event: any) {
    this.companyService.search(event.query).subscribe((companies) => (
      this.companies = companies
    ));
  }
}
