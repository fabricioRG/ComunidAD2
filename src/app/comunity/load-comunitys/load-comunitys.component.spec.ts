import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadComunitysComponent } from './load-comunitys.component';

describe('LoadComunitysComponent', () => {
  let component: LoadComunitysComponent;
  let fixture: ComponentFixture<LoadComunitysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadComunitysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadComunitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
