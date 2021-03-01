import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button'; 

@Component({
  selector: 'app-petitions',
  templateUrl: './petitions.component.html',
  styleUrls: ['./petitions.component.css']
})

export class PetitionsComponent implements OnInit {


  /*DEFINITIONS */
  enableButtonAcceptarSolicitud = false;
  users: User[] = [];
  usersArray: User[] = [
    { nombreCompleto: "Jesfrin", password: "Jess" },
    { nombreCompleto: "Bryan", password: "bryan" },
    { nombreCompleto: "Carlos", password: "carlos" },
  ];

  displayedColumns: string[] = ['select','registroAcademico','nombreCompleto','correoElectronico','genero','ciudad','estado','rolUsuario'];
  dataSource = new MatTableDataSource<User>(this.users);
  selection = new SelectionModel<User>(true, []);

  response: number | undefined;


  /* CONSTRUCTOR */
  constructor(private dataService: DataService) { }


  /* FUNCTIONS */
  printUsers(){
    // console.log(this.users);
    this.dataSource = new MatTableDataSource<User>(this.users.filter(function (user) {
      return !user.estado?.localeCompare("EN_ESPERA");
    }))
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log("numSelected: ", numSelected, "numRows: ", numRows);
    if(numSelected > 0){
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

  setStateButtonAcceptarSolicitud(state: boolean){
    this.enableButtonAcceptarSolicitud = state;
  }

  aceptarSolicitudPressedButton(){
    const numSelected = this.selection.selected.length;
    if(numSelected > 0){
      this.selection.selected.forEach(row => this.postAdminCreation(row.registroAcademico!))
      console.log("Printing")
    } else {
      console.log("Not enough")
    }
     setTimeout(function(){location.reload()}, 500);
  }

  postAdminCreation(registroAcademico: string){
    return this.dataService.postAdminCreation(registroAcademico)
    .subscribe(data => this.response = data);
  }

  updateUsers(){
    return this.dataService.getAllUsers()
    .subscribe(data => {
      this.users = data;
      this.dataSource = new MatTableDataSource<User>(this.users.filter(function (user) {
        return !user.estado?.localeCompare("EN_ESPERA");
      }))
    });
  }

  ngOnInit() {
    return this.updateUsers();
  }

}
