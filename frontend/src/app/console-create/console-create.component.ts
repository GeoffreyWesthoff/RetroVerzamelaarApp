import { Component, OnInit } from '@angular/core';
import {ConsoleService} from "../console/console.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Console} from "../console/console.schema";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-console-create',
  templateUrl: './console-create.component.html',
  styleUrls: ['./console-create.component.css']
})
export class ConsoleCreateComponent implements OnInit {

  consoleForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
      release_date: ['', [Validators.required]],
      market_price: [null, [Validators.required]],
      image_url: ['', [Validators.required, Validators.pattern(/^(http|https):\/\//i)]],
      max_controllers: ['', Validators.required],
      online_capable: ['', [Validators.required, Validators.pattern('^(true|false)$' )]]
  }, {validators: []}
  )

  constructor(private consoleService: ConsoleService,private router: Router,private _route: ActivatedRoute, private readonly formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
  }


  onClickSubmit() {

    if (!this.consoleForm.valid) {
      this.consoleForm.markAllAsTouched();
      for (let control of Object.keys(this.consoleForm.controls)) {
        this.consoleForm.controls[control].markAsDirty();
      }
      return;
    }

    const newConsole = this.consoleService.createConsole(this.consoleForm.value).subscribe((consoles) => (this.consoleService.consoles.push(consoles)));
    this.router.navigate(['/console'])
  }

}
