import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleEditComponent } from './console-edit.component';

describe('ConsoleEditComponent', () => {
  let component: ConsoleEditComponent;
  let fixture: ComponentFixture<ConsoleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoleEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
