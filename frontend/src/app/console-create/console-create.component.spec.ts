import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleCreateComponent } from './console-create.component';

describe('ConsoleCreateComponent', () => {
  let component: ConsoleCreateComponent;
  let fixture: ComponentFixture<ConsoleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoleCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
