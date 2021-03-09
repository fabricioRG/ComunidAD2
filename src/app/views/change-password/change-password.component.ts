import { Component, OnInit } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActiveModalComponent } from '../../components/active-modal/active-modal.component'
import { MustMatch } from '../../helpers/must-match.validator';
import { DataService } from 'src/app/data.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';

const USRS: User[] = [
  {
    registroAcademico: '201035894',
    nombreCompleto: 'Joseph Stews',
    correoElectronico: 'joseph@gmail.com'
  },
  {
    registroAcademico: '201754987',
    nombreCompleto: 'Benout Reim',
    correoElectronico: 'benout@gmail.com'
  },
  {
    registroAcademico: '201789751',
    nombreCompleto: 'James Hours',
    correoElectronico: 'james@gmail.com'
  },
  {
    registroAcademico: '201845783',
    nombreCompleto: 'Maximus Selt',
    correoElectronico: 'maximus@gmail.com'
  },
]

// Search into table of users
function search2(text: string, pipe: PipeTransform): User[] {
  return USRS.filter(user => {
    const term2 = text.toLowerCase();
    return user.correoElectronico?.toLowerCase().includes(term2)
      || user.registroAcademico?.toLowerCase().includes(term2)
      || user.nombreCompleto?.toLowerCase().includes(term2)
  });
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  // Token
  token: any;

  // Table visibility
  selectedUser: boolean = false;
  selectedUserObject: User = USRS[0];

  // Password visibility
  hide = true;
  hide2 = true;

  // Alerts visibility
  alertClosedSuccess = false;
  alertClosedWarning = true;
  alertClosedDanger = false;

  // Validation
  registerForm: FormGroup;
  generalPipe: DecimalPipe;

  users$: Observable<User[]>;
  usrs: User[];
  filter = new FormControl('');

  // Principal contructor
  constructor(private dataService: DataService, pipe: DecimalPipe,
    private _modalService: NgbModal, private formBuilder: FormBuilder) {
    this.token = localStorage.getItem('token');
    this.token = JSON.parse(this.token).token;
    this.generalPipe = pipe;
    this.updateUsers(pipe);
    // this.users$ = this.filter.valueChanges.pipe(
    //   startWith(''),
    //   map(text => this.search(text, pipe))
    // );

  }

  ngOnInit() {
    this.registerForm = this.formBuilder
      .group({
        password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(30),Validators.pattern(ConstantesService.REGEX_PASSWORD)]],
        confirmPassword: ['', Validators.required]
      },
        {
          validator: MustMatch('password', 'confirmPassword')
        });
  }

  search(listUsers: User[], text: string, pipe: PipeTransform): User[] {
    // this.updateUsers();
    // console.log("users:: ", this.usrs);
    return listUsers.filter(user => {
      const term2 = text.toLowerCase();
      return user.correoElectronico?.toLowerCase().includes(term2)
        || user.registroAcademico?.toLowerCase().includes(term2)
        || user.nombreCompleto?.toLowerCase().includes(term2)
    });
  }

  get f() { return this.registerForm.controls; }

  selectUser(selectedUser: User) {
    console.log(selectedUser);
    this.selectedUser = true;
    this.selectedUserObject = selectedUser;
  }

  cancelarButton() {
    this.initAlerts();
    this.registerForm.reset();
    this.selectedUser = false;
    this.updateUsers(this.generalPipe);
  }

  cambiarContraseniaButton() {
    if (!this.registerForm.invalid) {
      this.openModalConfirm()
    } else {
      this.alertClosedDanger = true;
    }
  }

  openModalConfirm() {
    console.log("User Pass: ", this.selectedUserObject.password)
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = 'Cambiar Contraseña';
    modal.componentInstance.modalBodyTitle = '¿Estás seguro que deseas cambiar la contraseña?';
    modal.componentInstance.modalBody = 'Si aceptas se cambiara de manera permanente, no habrá forma de revertir los cambios';
    modal.componentInstance.confirmModal = true;

    modal.result.then((result) => {
    this.postChangePasswordUser(this.selectedUserObject)
      console.log("Result: ", result);
    }, (reason) => {
      console.log("Reason: ", reason);
    });
  }

  confirmChangePassword() {
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = 'Proceso exitoso';
    modal.componentInstance.modalBodyTitle = 'Cambio de contraseña exitoso';
    modal.componentInstance.modalBody = 'Se ha cambiado la contraseña de manera correcta. Para acceder al usuario deberá utilizar la nueva contraseña';
    modal.componentInstance.infoModal = true;

    modal.result.then((result) => {
      console.log("Result: ", result);
    }, (reason) => {
      console.log("Reason: ", reason);
    });

    this.cancelarButton();
  }

  errorMessage(){
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = 'Proceso erroneo';
    modal.componentInstance.modalBodyTitle = 'No se ha realizado ningun cambio';
    modal.componentInstance.modalBody = 'Ha ocurrido un error inesperado. No se ha realizado ningun cambio solicitado';
    modal.componentInstance.infoModal = true;

    modal.result.then((result) => {
      console.log("Result: ", result);
    }, (reason) => {
      console.log("Reason: ", reason);
    });

    this.cancelarButton();
  }

  initAlerts() {
    this.alertClosedDanger = false;
    this.alertClosedSuccess = false;
    this.alertClosedWarning = true;
  }

  postChangePasswordUser(usr: User){
    var aux = new User();
    aux.token = this.token;
    return this.dataService.postChangePasswordUser(usr,aux)
    .subscribe(
      (data) => {
        console.log("Data:::: ", data)
        if(data){
          this.confirmChangePassword();
        }
      },
      (error) => {
        console.log("Error:::: ", error)
        this.errorMessage();
      }
    )
  }

  updateUsers(pipe: PipeTransform) {
    var aux = new User();
    aux.token = this.token;
    console.log(aux.token);
    return this.dataService.getAllUsers(aux)
      .subscribe(data => {
        console.log("users: ", data)
        this.usrs = data;
        console.log("usrs: ", this.usrs)
        this.users$ = this.filter.valueChanges.pipe(
          startWith(''),
          map(text => this.search(this.usrs, text, pipe))
        );
      });
  }

  onSubmit(password: string) {

    // stop here if form is invalid
    console.log(password);
    this.selectedUserObject.password = password;
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
}

}