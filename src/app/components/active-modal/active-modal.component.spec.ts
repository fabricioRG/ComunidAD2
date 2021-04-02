import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  // it('constructor', () => {
  //   //arrange
  //   var activeModal = new ActiveModalComponent(TestBed.inject(NgbActiveModal));
  //   activeModal.ngOnInit();
  //   //act
  //   //assert
  //   expect(activeModal).toBeTruthy();
    
  // });
  
});
