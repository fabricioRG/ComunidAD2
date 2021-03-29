import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-unsuscribe-members',
  templateUrl: './unsuscribe-members.component.html',
  styleUrls: ['./unsuscribe-members.component.css']
})
export class UnsuscribeMembersComponent implements OnInit {

  comunityAssign: ComunityAssign;
  comunity: Comunity;
  user: User;
  //Comunidad del usuario logueado
  comunidadEsDelUsuarioLogueado : boolean;
  //Formulario
  filtroForm : FormGroup;
  //Tabla
  displayedColumns: string[] = ['registroAcademico', 'nombreCompleto', 'fechaCreacion', 'estado'];
  comunityAssignList : any;

  constructor(private dataService: DataService, private sessionService: SesionService,
    private route: ActivatedRoute, private redirection: Router) {
      this.cargarDatos()
      this.filtroForm=this.createFormGroup()
     }

  ngOnInit(): void {
  }

  cargarDatos() {
    this.comunityAssign = new ComunityAssign();
    this.comunity = new Comunity();
    this.user = new User();
    var idComunidad: string | null = this.route.snapshot.paramMap.get('id')
    if (this.sessionService.exitSession() && idComunidad) {
      //Se debe verificar que la comunidad sea del usuario, de lo contrario redirigir
      if (idComunidad) {
        var y: number = +idComunidad;
        this.comunity.id = y;
        this.verificarSiComunidadEsDelUsuarioLogueado();
      }
    } else {
      this.redirection.navigate(['inicio'])
    }
  }

  verificarSiComunidadEsDelUsuarioLogueado() {
    this.dataService.getUserByToken(this.sessionService.getUserWithToken()).subscribe(
      (response) => {
        this.user = response;
        this.dataService.findComunityById(this.comunity, this.user).subscribe(
          (response) => {
            this.comunityAssign = response;
            if (response.user?.registroAcademico === this.user.registroAcademico) {//Siel registroAcadmico de la comunidad que se recibio es igual al registroAcademico de usuario, es su comunidad
              this.comunidadEsDelUsuarioLogueado = true;
            } else {
              this.comunidadEsDelUsuarioLogueado = false;
              console.log("No puedes ver esto")
              this.redirection.navigate(['inicio']);
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      (error) => {
        console.log(error)
      }
    )
  }

  createFormGroup(){
    return new FormGroup({
      registroAcademico : new FormControl('',[ Validators.minLength(1), Validators.maxLength(9)])
    })
  }

  onSaveForm(){

    var registroFilter=this.filtroForm.get('registroAcademico')?.value;
    if(registroFilter){
      console.log("Si hay registro academico:",registroFilter)
    }else{
      console.log("No hay registro academico:o")
    }
  }

  eliminarUsuario(element : any){
    
  }

  get f (){
    return this.filtroForm.controls;
  }

}
