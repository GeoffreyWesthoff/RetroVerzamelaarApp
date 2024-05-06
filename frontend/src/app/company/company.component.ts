import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from './company.service';
import { Company } from './company.schema';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit {
  companies: Company[] = this.companyService.companies;

  @ViewChild('searchBox') searchBox!: ElementRef;

  constructor(private readonly companyService: CompanyService, readonly authService: AuthenticationService) {}

  ngOnInit(): void {
      this.getCompanies()
  }

  search() {
    let input = this.searchBox.nativeElement.value;
    console.log(this.searchBox.nativeElement.value);
    if (input === null) {this.getCompanies()}
    this.companyService.search(input).subscribe((companies) => {this.companies = this.companyService.companies = companies})
  
  }

  getCompanies() {
    this.companyService.getCompanies().subscribe((companies) => {
      this.companies = this.companyService.companies = companies;
    })
  }

  delete(company: Company) {
    this.companies = this.companies.filter((h) => h !== company);
    this.companyService.deleteCompany(company.id).subscribe()
  }
}
