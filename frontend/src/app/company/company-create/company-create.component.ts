import { Component } from '@angular/core';
import { CompanyService } from '../company.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Company } from '../company.schema';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.css'
})
export class CompanyCreateComponent {

  companyForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
      establishment_year: ['', [Validators.required]],
      annual_revenue: [null, [Validators.required]],
      image_url: ['', [Validators.required, Validators.pattern(/^(http|https):\/\//i)]],
      country: ['', Validators.required]
  }, {validators: []}
  )

  constructor(private companyService: CompanyService,private router: Router,private _route: ActivatedRoute,
    private readonly formBuilder: FormBuilder) {

  }

  onClickSubmit() {

    const form = this.companyForm.value;

    if (!form.name || !form.country || !form.establishment_year || !form.annual_revenue || !form.image_url) {
      this.companyForm.markAllAsTouched();
      for (let control of Object.keys(this.companyForm.controls)) {
        this.companyForm.controls[control].markAsDirty();
      }
      return;
    }

    if (!this.companyForm.valid) {
      this.companyForm.markAllAsTouched();
      for (let control of Object.keys(this.companyForm.controls)) {
        this.companyForm.controls[control].markAsDirty();
      }
      return;
    }

    const newCompany = this.companyService.createCompany(form).subscribe((company) => (this.companyService.companies.push(company)));
    this.router.navigate(['/company'])
  }
}
