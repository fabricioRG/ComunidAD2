import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveModalComponent } from './active-modal.component';

describe('ActiveModalComponent', () => {
  let component: ActiveModalComponent;
  let fixture: ComponentFixture<ActiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
