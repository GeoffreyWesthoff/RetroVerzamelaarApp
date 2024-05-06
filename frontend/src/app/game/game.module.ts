import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { GameDetailComponent } from './game-detail.component';
import { GameComponent } from './game.component';
import { GameService } from './game.service';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { GameCreateComponent } from './create/game-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsoleService } from '../console/console.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyService } from '../company/company.service';
import { GameEditComponent } from './edit/game-edit.component';
import { CollectModalModule } from '../collect-modal/collect-modal.module';
@NgModule({
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule, AutoCompleteModule, NoopAnimationsModule, CollectModalModule, ReactiveFormsModule],
  providers: [UserService, GameService, AuthenticationService, ConsoleService, CompanyService],
  declarations: [GameDetailComponent, GameComponent, GameCreateComponent, GameEditComponent],
})
export class GameModule {}
