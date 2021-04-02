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

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let dataService: DataService;
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
    component = new ChangePasswordComponent(
      dataService,
      TestBed.inject(DecimalPipe),
      TestBed.inject(NgbModal),
      TestBed.inject(FormBuilder)
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
  // it('cambiarContraseniaButtonValid', () => {
  //   component.registerForm = component.formBuilder.group(
  //     {
  //       password: [
  //         '',
  //         [
  //           Validators.required,
  //           Validators.minLength(6),
  //           Validators.maxLength(30),
  //           Validators.pattern(ConstantesService.REGEX_PASSWORD),
  //         ],
  //       ],
  //       confirmPassword: ['', Validators.required],
  //     },
  //     {
  //       validator: MustMatch('password', 'confirmPassword'),
  //     }
  //   );
  //   component.registerForm.controls['confirmPassword'].setValue('Juan1!');
  //   component.registerForm.controls['password'].setValue('Juan1!');

  //   component.cambiarContraseniaButton();
  //   var spy = spyOn(component, 'openModalConfirm').and.stub();
  //   //expect(component.selectedUser).toBeFalsy();
  //   expect(spy).toHaveBeenCalled();
  // });
});
