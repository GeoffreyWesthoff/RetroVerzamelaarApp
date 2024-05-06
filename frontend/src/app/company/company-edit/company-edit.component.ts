import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Company } from '../company.schema';
import { CompanyService } from '../company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrl: './company-edit.component.css'
})
export class CompanyEditComponent {
  company: Company = {
    id: '',
    name: '',
    establishment_year: new Date(),
    image_url: '',
    annual_revenue: 0,
    country: ''
  }

  companyForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
      establishment_year: ['', [Validators.required]],
      annual_revenue: [null, [Validators.required]],
      image_url: ['', [Validators.required, Validators.pattern(/^(http|https):\/\//i)]],
      country: ['', Validators.required]
  }, {validators: []}
  )

  
  constructor(private companyService: CompanyService,private router: Router,private _route: ActivatedRoute, private readonly formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.getCompany()
  }

  getCompany(): void {
    this.companyService.getCompany(this._route.snapshot.params['id']).subscribe((company) => {
      this.company = company;
    })
  }


  onClickSubmit() {
    let companyIndex: number = 0;
    this.companyService.companies.forEach((n: Company) => {
      if (n.id == this.company.id) {
        companyIndex = this.companyService.companies.indexOf(n)
      }

    });


    if (!this.companyForm.valid) {
      this.companyForm.markAllAsTouched();
      for (let control of Object.keys(this.companyForm.controls)) {
        this.companyForm.controls[control].markAsDirty();
      }
      return;
    }

    const editCompany = this.companyService.editCompany(this._route.snapshot.params['id'], this.companyForm.value).subscribe((companyEdit) => (this.companyService.companies[companyIndex] = companyEdit));
    this.router.navigate(['/company'])
  }
}
