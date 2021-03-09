import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComunityComponent } from './create-comunity.component';

describe('CreateComunityComponent', () => {
  let component: CreateComunityComponent;
  let fixture: ComponentFixture<CreateComunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateComunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   
});
