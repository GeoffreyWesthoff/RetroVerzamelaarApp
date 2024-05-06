import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { CompanyService } from './company.service';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { CompanyCreateComponent } from './company-create/company-create.component';



@NgModule({
  declarations: [
    CompanyComponent,
    CompanyDetailComponent,
    CompanyEditComponent,
    CompanyCreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ], providers: [
    AuthenticationService,
    CompanyService
  ]
})
export class CompanyModule { }
