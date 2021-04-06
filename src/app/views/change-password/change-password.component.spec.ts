import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/data.service';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { User } from 'src/app/user.model';
import valueUser from 'src/app/Test/ArchivosJson/User3.json';

import { ChangePasswordComponent } from './change-password.component';
import { Observable, of } from 'rxjs';
import { throwError } from 'rxjs';
import { ModalService } from 'src/app/services/modal/modal.service';
import datosUsers from 'src/app/Test/ArchivosJson/Users.json';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let dataService: DataService;
  let modal: ModalService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [HttpClientTestingModule, RouterTestingModule], //,
      providers: [
        HeadersService,
        HttpClient,
        DataService,
        DecimalPipe,
        FormBuilder,
        NgbModal,
        ModalService,
      ],
    }).compileComponents();
    spyOn(localStorage.__proto__, 'getItem').and.returnValue('true');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    //component = fixture.componentInstance;
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    modal = new ModalService(TestBed.inject(NgbModal));
    component = new ChangePasswordComponent(
      dataService,
      TestBed.inject(DecimalPipe),
      TestBed.inject(NgbModal),
      TestBed.inject(FormBuilder),
      modal
    );

    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('onInit', () => {
    component.registerForm = component.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
            Validators.pattern(ConstantesService.REGEX_PASSWORD),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
    component.registerForm.controls['password'].setValue('1');
    component.registerForm.controls['confirmPassword'].setValue('1');
    expect(component.registerForm.controls['confirmPassword'].value).toEqual(
      '1'
    );
    expect(component.registerForm.controls['password'].value).toEqual('1');
  });

  it('search', () => {
    var users: User[] = [
      {
        registroAcademico: '1',
      },
      {
        registroAcademico: '2',
      },
    ];

    var spy1 = spyOn(users, 'filter').and.returnValue(users);

    var result = component.search(users, 'a', component.generalPipe);
    expect(result.length).toBe(2);
  });

  it('getF', () => {
    var result = component.f;
    expect(result).toBeTruthy();
  });

  it('selectUser', () => {
    var result = component.selectUser(valueUser);
    expect(component.selectedUserObject).toBe(valueUser);
  });

  it('cancelarButton', () => {
    component.cancelarButton();
    expect(component.selectedUser).toBeFalsy();
  });
  it('cambiarContraseniaButtonInvalid', () => {
    component.cambiarContraseniaButton();
    var spy = spyOn(component, 'openModalConfirm').and.stub();
    //expect(component.selectedUser).toBeFalsy();
    expect(spy).not.toHaveBeenCalled();
  });

  it('cambiarContraseniaButtonValid', () => {
    var spy = spyOn(component, 'openModalConfirm').and.stub();
    //component.ngOnInit();
    component.registerForm.controls['confirmPassword'].setValue('Juan1!');
    component.registerForm.controls['password'].setValue('Juan1!');

    //fixture.detectChanges();
    component.cambiarContraseniaButton();
    expect(spy).toHaveBeenCalled();
  });

  it('confirmChangePassword', () => {
    var spy = spyOn(component, 'cancelarButton').and.stub();
    component.confirmChangePassword();
    expect(spy).toHaveBeenCalled();
  });

  it('errorMessage', () => {
    var spy = spyOn(component, 'cancelarButton').and.stub();
    component.errorMessage();
    expect(spy).toHaveBeenCalled();
  });

  it('initAlerts', () => {
    var result1 = false;
    var result2 = false;
    var result3 = true;
    component.initAlerts();
    expect(component.alertClosedDanger).toBe(result1);
    expect(component.alertClosedSuccess).toBe(result2);
    expect(component.alertClosedWarning).toBe(result3);
  });

  it('postChangePasswordUserCorrect', () => {
    var spy = spyOn(dataService, 'postChangePasswordUser').and.returnValue(
      of(1)
    );
    var spy2 = spyOn(component, 'confirmChangePassword').and.stub();
    component.postChangePasswordUser(new User());
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('postChangePasswordUserInvalid', () => {
    var spy = spyOn(dataService, 'postChangePasswordUser').and.returnValue(
      throwError('2')
    );
    var spy2 = spyOn(component, 'errorMessage').and.stub();
    component.postChangePasswordUser(new User());
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('clickSearchUser', () => {
    var spy2 = spyOn(dataService, 'getUsersByFiltering').and.returnValue(
      of(datosUsers)
    );
    component.clickSearchUser();
    expect(spy2).toHaveBeenCalled();
  });
  it('updateUsers', () => {
    var spy2 = spyOn(dataService, 'getUsersByFiltering').and.returnValue(
      of(datosUsers)
    );
    component.updateUsers(component.generalPipe);
    expect(spy2).toHaveBeenCalled();
    expect(component.usrs).toBe(datosUsers);
  });
  it('onSubmit', () => {
    var expected = 'a';
    component.selectedUserObject = datosUsers[0];
    component.onSubmit(expected);

    expect(component.selectedUserObject.password).toBe(expected);
  });
  it('openModalConfirm', async () => {
    component.selectedUserObject = datosUsers[0];
    var spy1 = spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    var spy2 = spyOn(component, 'postChangePasswordUser').and.stub();

    await component.openModalConfirm();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
