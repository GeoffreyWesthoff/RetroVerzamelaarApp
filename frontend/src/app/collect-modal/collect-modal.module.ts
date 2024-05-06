import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectModalComponent } from './collect-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user/user.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConsoleService } from '../console/console.service';



@NgModule({
  declarations: [CollectModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [UserService, ConsoleService],
  exports: [CollectModalComponent]
})
export class CollectModalModule { }
