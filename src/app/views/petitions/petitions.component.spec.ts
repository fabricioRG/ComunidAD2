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
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { of } from 'rxjs';
import datosUsers from 'src/app/Test/ArchivosJson/Users.json';
import { MockNgbModalRef } from 'src/app/services/modal/modal.service.spec';

describe('PetitionsComponent', () => {
  let component: PetitionsComponent;
  let fixture: ComponentFixture<PetitionsComponent>;
  let dataService: DataService;
  let modal: ModalService;
  let modalService: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule,
        NgbModule
      ],
      providers: [
        HeadersService,
        HttpClient,
        DataService,
        DecimalPipe,
        FormBuilder,
        NgbModal,
        ModalService,
        NgbModal,
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
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('onInit', () => {
    component.dataSource.data = [
      {
        registroAcademico: '20923432'
      },
      {
        registroAcademico: '23452353'
      }
    ];
    expect(component).toBeTruthy();
  });

  it('isAllSelected', () => {
    component.selection.selected.length = 2;
    component.dataSource.data.length = 2;
    expect(component.isAllSelected()).toBeTruthy();
  });

  it('isAllSelectedOption2', () => {
    component.selection.selected.length = 1;
    expect(component.isAllSelected()).toBeFalsy();
  });

  it('masterToggleWithData', () => {
    spyOn(component, 'isAllSelected').and.returnValue(true);
    let spy = spyOn(component.selection, 'clear').and.stub();
    component.masterToggle();
    expect(spy).toHaveBeenCalled();
  });

  it('masterToggleWithoutData', () => {
    spyOn(component, 'isAllSelected').and.returnValue(false);
    let spy = spyOn(component.dataSource.data, 'forEach').and.stub();
    component.masterToggle();
    expect(spy).toHaveBeenCalled();
  });

  it('checkboxLabelWithData', () => {
    let spy = spyOn(component, 'isAllSelected').and.stub();
    component.checkboxLabel();
    expect(spy).toHaveBeenCalled();
  });

  it('checkboxLabelWithoutData', () => {
    let spy = spyOn(component.selection, 'isSelected').and.stub();
    component.checkboxLabel({
      registroAcademico: '2343252'
    });
    expect(spy).toHaveBeenCalled();
  });

  it('setStateButtonAcceptarSolicitud', () => {
    let expResult = false;
    let param = false;
    component.setStateButtonAcceptarSolicitud(param);
    expect(component.enableButtonAcceptarSolicitud).toEqual(expResult);
  });

  it('aceptarSolicitudPressedButtonWithSelections', () => {
    component.selection.selected.length = 1;
    let spy = spyOn(component, 'openModalConfirm').and.stub();
    component.aceptarSolicitudPressedButton();
    expect(spy).toHaveBeenCalled();
  });

  it('aceptarSolicitudPressedButtonWithoutSelections', () => {
    let spy = spyOn(component, 'openModalConfirm').and.stub();
    component.aceptarSolicitudPressedButton();
    expect(spy).not.toHaveBeenCalled();
  });
  
  it('acceptAdminRequest', () => {
    component.selection.selected.push({
      registroAcademico: '2345240'
    })
    let spy = spyOn(component.selection.selected, 'forEach').and.stub();
    component.acceptAdminRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('postAdminCreation', () => {
    let spy = spyOn(dataService, 'postAdminCreation').and.returnValue(of(1));
    component.postAdminCreation('param');
    expect(spy).toHaveBeenCalled();
  });

  it('updateUsers', () => {
    let spy = spyOn(dataService, 'getAllUsers').and.returnValue(of(datosUsers));
    component.updateUsers();
    expect(spy).toHaveBeenCalled();
  });

  it('openModalConfirm', async () => {
    let spy = spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    await component.openModalConfirm();
    expect(spy).toHaveBeenCalled();
  });

  it('confirmModal', () => {
    let spy = spyOn(component, 'updateUsers').and.stub();
    component.confirmModal();
    expect(spy).toHaveBeenCalled();
  });

  // it('errorMessage', async() => {
  //   let spy = spyOn(modalService, 'open').and.returnValue(await mockModalRef.result);
  //   component.errorMessage();
  //   expect(spy).toHaveBeenCalled();
  // })

  // it('ngAfterViewChecked', () => {
  //   let spy = spyOn(component, 'cdRef')
  // });

});
