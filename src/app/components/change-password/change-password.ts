import { Component } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ActiveModalComponent } from '../active-modal/active-modal.component'

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
export class ChangePasswordComponent {

  selectedUser: boolean = true;
  selectedUserObject: User = USRS[0];
  hide = true;
  hide2 = true;
  alertClosedSuccess = false;
  alertClosedWarning = true;
  alertClosedDanger = true;
  users$: Observable<User[]>;
  filter = new FormControl('');

  constructor(pipe: DecimalPipe, private _modalService: NgbModal) {
    this.users$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => search2(text, pipe))
    );

  }

  selectUser(selectedUser: User) {
    console.log(selectedUser);
    this.selectedUser = true;
    this.selectedUserObject = selectedUser;
  }

  cancelarButton() {
    this.selectedUser = false;
  }

  cambiarContraseniaButton() {

  }

  openModalConfirm(){
    this._modalService.open(ActiveModalComponent).result.then((result) => {
      console.log(result);
    }

    )
  }

}
