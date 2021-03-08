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

  // Table visibility
  selectedUser: boolean = true;
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

  users$: Observable<User[]>;
  filter = new FormControl('');

  // Principal contructor
  constructor(pipe: DecimalPipe, private _modalService: NgbModal, private formBuilder: FormBuilder) {
    this.users$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => search2(text, pipe))
    );

  }

  ngOnInit() {
    this.registerForm = this.formBuilder
      .group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
        {
          validator: MustMatch('password', 'confirmPassword')
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
  }

  cambiarContraseniaButton() {
    if (!this.registerForm.invalid) {
      
      this.openModalConfirm()
    } else {
      this.alertClosedDanger = true;
    }
  }

  openModalConfirm() {
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = 'Cambiar Contraseña';
    modal.componentInstance.modalBodyTitle = '¿Estás seguro que deseas cambiar la contraseña?';
    modal.componentInstance.modalBody = 'Si aceptas se cambiara de manera permanente, no habrá forma de revertir los cambios';
    modal.componentInstance.confirmModal = true;

    modal.result.then((result) => {
      this.confirmChangePassword();
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

  initAlerts(){
    this.alertClosedDanger = false;
    this.alertClosedSuccess = false;
    this.alertClosedWarning = true;
  }

}
