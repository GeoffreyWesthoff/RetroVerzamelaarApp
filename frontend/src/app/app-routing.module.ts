import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsoleDetailComponent } from './console-detail/console-detail.component';
import { ConsoleComponent } from './console/console.component';
import {ConsoleCreateComponent} from "./console-create/console-create.component";
import {ConsoleEditComponent} from "./console-edit/console-edit.component";
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { UserComponent } from './user/user.component';
import { GameDetailComponent } from './game/game-detail.component';
import { GameCreateComponent } from './game/create/game-create.component';
import { CompanyComponent } from './company/company.component';
import { GameEditComponent } from './game/edit/game-edit.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { CompanyCreateComponent } from './company/company-create/company-create.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ManageUserComponent } from './user/manage-user/manage-user/manage-user.component';
import { UserListComponent } from './user/user-list/user-list.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  { path: 'console', component: ConsoleComponent},
  { path: 'console/create', component: ConsoleCreateComponent},
  { path: 'console/:id', component: ConsoleDetailComponent },
  {path: 'console/:id/edit', component: ConsoleEditComponent},
  {path: 'game', component: GameComponent},
  {path: 'game/create', component: GameCreateComponent},
  {path: 'game/:id', component: GameDetailComponent},
  {path: 'game/:id/edit', component: GameEditComponent},
  {path: 'company', component: CompanyComponent},
  {path: 'company/create', component: CompanyCreateComponent},
  {path: 'company/:id', component: CompanyDetailComponent},
  {path: 'company/:id/edit', component: CompanyEditComponent},
  {path: 'login', component: LoginComponent},
  {path: 'user/:username', component: UserComponent},
  {path: 'about', component: AboutComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'users', component: UserListComponent},
  {path: 'user/:username/edit', component: ManageUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
