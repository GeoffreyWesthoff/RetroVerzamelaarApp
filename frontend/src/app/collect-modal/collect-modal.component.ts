import { Component, OnInit } from '@angular/core';
import { Game } from '../game/game.schema';
import { Console } from '../console/console.schema';
import { GameService } from '../game/game.service';
import { ConsoleService } from '../console/console.service';
import { UserService } from '../user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-collect-modal',
  templateUrl: './collect-modal.component.html',
  styleUrl: './collect-modal.component.css'
})
export class CollectModalComponent {
  
  collectable!: Console | Game;
  consoles: Console[] = [];
  selectedConsole: Console = {
    id: '',
    name: '',
    release_date: new Date(),
    market_price: 0,
    image_url: '',
    online_capable: false,
    max_controllers: 0
  };
  type!: string;

  error = '';

  collectForm: FormGroup = this.formBuilder.group(
    {
      region: [null, Validators.required],
      purchase_price: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      for_console: ['']
    }, 
  )

  constructor(
    private readonly userService: UserService,
    private readonly consoleService: ConsoleService,
    private readonly formBuilder: FormBuilder
  ) {}

  close() {
    document.querySelector('body')?.classList.remove('modal-open');
    document.querySelector('#collectModal')?.classList.remove('fade', 'show');
    //@ts-ignore
    document.querySelector('#collectModal').style =''
  }

  searchConsoles(event: any) {
    this.consoleService.search(event.query).subscribe((consoles) => (
      this.consoles = consoles
    ));
  }
  
  collect() {
    if (this.selectedConsole.id !== '') {
      this.selectedConsole.id = this.collectForm.get('for_console')?.value.id;
    }

    console.log(this.collectForm.get('for_console')?.value)

    if (!this.collectForm.get('purchase_price')?.value || !this.collectForm.get('condition')?.value || !this.collectForm.get('purchase_price')?.value) {
      this.collectForm.markAllAsTouched();
      this.collectForm.get('purchase_price')?.markAsDirty();
      this.collectForm.get('condition')?.markAsDirty();
      this.collectForm.get('region')?.markAsDirty();
      this.collectForm.get('for_console')?.markAsDirty();
      this.collectForm.updateValueAndValidity();
      return;
    }

    const data = {
      region: this.collectForm.get('region')?.value,
      condition: this.collectForm.get('condition')?.value,
      for_console: this.collectForm.get('for_console')?.value.id,
      purchase_price: this.collectForm.get('purchase_price')?.value
    }

    if (this.type === 'game') {
      if (!this.collectForm.get('for_console')?.value) {
        this.collectForm.markAllAsTouched();
      this.collectForm.get('purchase_price')?.markAsDirty();
      this.collectForm.get('condition')?.markAsDirty();
      this.collectForm.get('region')?.markAsDirty();
      this.collectForm.get('for_console')?.markAsDirty();
      this.collectForm.updateValueAndValidity();
        return;
      }
    }

    this.userService.collect(this.collectable, this.type, data).subscribe((resp => {
      console.log('suc6')
      this.close();
    }), error => {
      this.error = error.error.message;
    })
    
  }
}
