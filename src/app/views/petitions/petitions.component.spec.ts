import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetitionsComponent } from './petitions.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { ModalService } from 'src/app/services/modal/modal.service';
import { DataService } from 'src/app/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatTable } from '@angular/material/table';

describe('PetitionsComponent', () => {
  let component: PetitionsComponent;
  let fixture: ComponentFixture<PetitionsComponent>;
  let dataService: DataService;
  let modal: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        HeadersService,
        HttpClient,
        DataService,
        DecimalPipe,
        FormBuilder,
        NgbModal,
        ModalService,
        ChangeDetectorRef,
      ],
    }).compileComponents();
    spyOn(localStorage.__proto__, 'getItem').and.returnValue('true');
    //spyOn(component, 'updateUsers').and.stub();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetitionsComponent);
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    modal = new ModalService(TestBed.inject(NgbModal));
    component = new PetitionsComponent(
      dataService,
      TestBed.inject(NgbModal),
      TestBed.inject(ChangeDetectorRef),
      modal
    );
    fixture.detectChanges();
    component.ngOnInit();
  });

  // it('should be created', () => {
  //   spyOn(component.tableUsers, 'renderRows').and.stub();
  //   expect(component).toBeTruthy();
  // });
});
