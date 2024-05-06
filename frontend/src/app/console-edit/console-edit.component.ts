import { Component, OnInit } from '@angular/core';
import {ConsoleService} from "../console/console.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Console } from "../console/console.schema";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-console-edit',
  templateUrl: './console-edit.component.html',
  styleUrls: ['./console-edit.component.css']
})
export class ConsoleEditComponent implements OnInit {

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

  constructor(private consoleService: ConsoleService,private router: Router, private _route: ActivatedRoute, private readonly formBuilder: FormBuilder) {

  }

  console: any = undefined;


  ngOnInit(): void {
    this.getConsole();
  }

  getConsole(): void {
    this.consoleService
      .getConsole(this._route.snapshot.params['id'])
      .subscribe((console) => (this.console = console));
  }

  onClickSubmit() {
    if (!this.consoleForm.valid) {
      this.consoleForm.markAllAsTouched();
      for (let control of Object.keys(this.consoleForm.controls)) {
        this.consoleForm.controls[control].markAsDirty();
      }
      return;
    }

    
    let consoleIndex: number = 0;
    this.consoleService.consoles.forEach((n: Console) => {
      if (n.id == this.console.id) {
        consoleIndex = this.consoleService.consoles.indexOf(n)
      }

    });
    const newConsole = this.consoleService.editConsole(this._route.snapshot.params['id'], this.consoleForm.value).subscribe((consoles) => (this.consoleService.consoles[consoleIndex] = consoles));
    this.router.navigate(['/console'])
  }
}
