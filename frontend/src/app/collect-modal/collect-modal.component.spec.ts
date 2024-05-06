import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectModalComponent } from './collect-modal.component';

describe('CollectModalComponent', () => {
  let component: CollectModalComponent;
  let fixture: ComponentFixture<CollectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
