import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComunityComponent } from './view-comunity.component';

describe('ViewComunityComponent', () => {
  let component: ViewComunityComponent;
  let fixture: ComponentFixture<ViewComunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewComunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
