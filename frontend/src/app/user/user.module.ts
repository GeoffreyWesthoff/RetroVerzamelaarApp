import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { RouterModule } from '@angular/router';
import { ConsoleService } from '../console/console.service';
import { ConsoleModule } from '../console/console.module';
import { CollectModalModule } from '../collect-modal/collect-modal.module';
import { ManageUserComponent } from './manage-user/manage-user/manage-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './user-list/user-list.component';



@NgModule({
  declarations: [UserComponent, ManageUserComponent, UserListComponent],
  imports: [
    NgbModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    ConsoleModule,
    CollectModalModule,
    ReactiveFormsModule
  ],
  providers: [UserService]
})
export class UserModule { }
