import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestComunityComponent } from './request-comunity.component';

describe('RequestComunityComponent', () => {
  let component: RequestComunityComponent;
  let fixture: ComponentFixture<RequestComunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestComunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
