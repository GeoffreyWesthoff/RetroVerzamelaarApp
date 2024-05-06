import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsoleComponent } from './console/console.component';
import { ConsoleDetailComponent } from './console-detail/console-detail.component';
import { ConsoleCreateComponent } from './console-create/console-create.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ConsoleEditComponent } from './console-edit/console-edit.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { UserComponent } from './user/user.component';
import { AuthenticationService } from './authentication.service';
import { CommonModule } from '@angular/common';
import { UserService } from './user/user.service';
import { RouterModule } from '@angular/router';
import { ConsoleModule } from './console/console.module';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { CompanyModule } from './company/company.module';
import { LoginModule } from './login/login.module';
import { CollectModalComponent } from './collect-modal/collect-modal.component';
import { GameService } from './game/game.service';
import { ConsoleService } from './console/console.service';
import { CompanyService } from './company/company.service';
import { SignupComponent } from './signup/signup.component';
import { SignupModule } from './signup/signup.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ConsoleModule,
    LoginModule,
    UserModule,
    GameModule,
    CompanyModule,
    SignupModule,
  ],
  providers: [AuthenticationService, GameService, ConsoleService, CompanyService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
