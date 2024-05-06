import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { ConsoleService } from './console.service';
import { Router, RouterModule } from '@angular/router';
import { ConsoleDetailComponent } from '../console-detail/console-detail.component';
import { AuthenticationService } from '../authentication.service';
import { ConsoleCreateComponent } from '../console-create/console-create.component';
import { ConsoleEditComponent } from '../console-edit/console-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectModalModule } from '../collect-modal/collect-modal.module';

@NgModule({
  declarations: [ConsoleComponent, ConsoleDetailComponent, ConsoleCreateComponent, ConsoleEditComponent],
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule, ReactiveFormsModule, CollectModalModule],
  providers: [ConsoleService, UserService, AuthenticationService]
})
export class ConsoleModule {}
