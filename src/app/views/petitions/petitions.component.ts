import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-petitions',
  templateUrl: './petitions.component.html',
  styleUrls: ['./petitions.component.css']
})

export class PetitionsComponent implements OnInit {

  @ViewChild(MatTable) tableUsers: MatTable<any>;

  /*DEFINITIONS */
  enableButtonAcceptarSolicitud = false;
  users: User[] = [];

  displayedColumns: string[] = ['select', 'registroAcademico', 'nombreCompleto', 'correoElectronico', 'genero', 'ciudad', 'estado', 'rolUsuario'];
  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);

  response: number | undefined;
  token: any;

  numErrors: number = 0;
  numSuccess: number = 0;

  /* CONSTRUCTOR */
  constructor(private dataService: DataService, private _modalService: NgbModal) {
    this.token = localStorage.getItem('token');
    this.token = JSON.parse(this.token).token;
  }


  /* FUNCTIONS */
  // printUsers() {
  //   // console.log(this.users);
  //   this.dataSource = new MatTableDataSource<User>(this.users.filter(function (user) {
  //     return !user.estado?.localeCompare("EN_ESPERA");
  //   }))
  // }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log("numSelected: ", numSelected, "numRows: ", numRows);
    if (numSelected > 0) {
      this.setStateButtonAcceptarSolicitud(true);
    } else {
      this.setStateButtonAcceptarSolicitud(false);
    }
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: User): string {
    // console.log("row",row);
    // console.log("pressed: ", this.selection.selected)
    // console.log("Selections: ",this.selection.selected);
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }

  setStateButtonAcceptarSolicitud(state: boolean) {
    this.enableButtonAcceptarSolicitud = state;
  }

  aceptarSolicitudPressedButton() {
    const numSelected = this.selection.selected.length;
    if (numSelected > 0) {
      this.updateUsers();
      // this.openModalConfirm();
      // this.selection.selected.forEach(
      //   row => this.postAdminCreation(row.registroAcademico!))
      // console.log("Printing")
    } else {
      console.log("Not enough")
    }
    // setTimeout(function () { location.reload() }, 500);
  }

  acceptAdminRequest() {
    this.selection.selected.forEach(
      (row) => {
        this.postAdminCreation(row.registroAcademico!)
      });
  }

  postAdminCreation(registroAcademico: string) {
    var aux = new User();
    aux.token = this.token;
    this.dataService.postAdminCreation(registroAcademico, aux)
      .subscribe(
        (data) => {
          this.response = data
          console.log("Data:: ", data)
        },
        (error) => {
          this.numErrors++;
          console.log("Error: ", error)
        }
      )
  }

  updateUsers() {
    console.log("updating:::::")
    var aux = new User();
    aux.token = this.token;
    this.dataService.getAllUsers(aux)
      .subscribe((data) => {

        this.dataSource.data.length = 0;

        let result = data.filter(function (user) {
          return !user.estado?.localeCompare("EN_ESPERA");
        });

        result.forEach( usr => {
          this.dataSource.data.push(usr);
          // console.log(usr)
        })

        // this.users = data;
        // this.dataSource.data = data.filter(function (user) {
        //   return !user.estado?.localeCompare("EN_ESPERA");
        // });
        // console.log(this.dataSource);
        // console.log(data);
      });
      console.log("Data::",this.dataSource.data)
      this.tableUsers.renderRows();
      // this.paginator._changePageSize(this.paginator.pageSize);
  }

  ngOnInit() {
    return this.updateUsers();
  }

  openModalConfirm() {
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = 'Aceptar Solicitud';
    modal.componentInstance.modalBodyTitle = '¿Estás seguro que deseas cambiar la contraseña?';
    modal.componentInstance.modalBody = 'Si aceptas se cambiara de manera permanente, no habrá forma de revertir los cambios';
    modal.componentInstance.confirmModal = true;

    modal.result.then((result) => {
      this.acceptAdminRequest();
      if(this.numErrors > 0){
        this.errorMessage();
      } else {
        this.confirmModal();
      }
      this.numErrors = 0;
      console.log("Result: ", result);
    }, (reason) => {
      console.log("Reason: ", reason);
    });
  }

  confirmModal() {
    
    this.updateUsers();
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
    // this.cancelarButton();
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

    // this.cancelarButton();
  }

}
