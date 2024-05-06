import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parse, format } from 'date-fns';
import { GameService } from '../../game/game.service';
import { CompanyService } from '../company.service';
import { Game } from '../../game/game.schema';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.css'
})
export class CompanyDetailComponent {
  company: any;
  bestGames: Game[] = []
  

  constructor(
    private gameService: GameService,
    private _route: ActivatedRoute,
    private companyService: CompanyService,
  ) {}

  ngOnInit(): void {
    this.getCompany();
    this.getBest();  
  }

  parseDate(date: string) {
    console.log(date)
    return parse(date, "d-MM-uuuu", new Date());
  }

  formatDate(date: string) {
      return format(this.parseDate(date), 'PPP')
  }

  getCompany(): void {
    this.companyService
      .getCompany(this._route.snapshot.params['id'])
      .subscribe((company) => {
        this.company = company;
      });
  }

  getBest(): void {
    this.companyService
    .getBest(this._route.snapshot.params['id'])
    .subscribe((games) => (this.bestGames = games))
  }
}
