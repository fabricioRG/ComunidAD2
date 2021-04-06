import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private redirection: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private sessionService: SesionService
  ) {}
  user: User;
  actualUser: User;

  //Comunidades
  comunidades: ComunityAssign[];
  encabezadoFoto: string = 'data:image/jpeg;base64,';
  usuarioTieneComunidades: boolean;

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.user = new User();
    this.actualUser = new User();
    let idUser: string | null = this.route.snapshot.paramMap.get('id');
    if (this.sessionService.exitSession() && idUser) {
      if (idUser) {
        this.actualUser.registroAcademico = idUser;
        this.getUserInfo();
      }
    } else {
      this.redirection.navigate(['inicio']);
    }
  }

  getUserInfo() {
    this.dataService
      .getUserByToken(this.sessionService.getUserWithToken())
      .subscribe((response) => {
        this.user = response;
        //Buscando la comunidad para ver si es del usuario
        this.dataService.findUserById(this.actualUser, this.user).subscribe(
          (data) => {
            this.actualUser = data;
            this.getCommunitys();
          },
          (error) => {
            this.redirection.navigate(['inicio']);
          }
        );
      });
  }

  getCommunitys() {
    var user: User = this.sessionService.getUserWithToken();
    user.registroAcademico = this.actualUser.registroAcademico;
    this.dataService.findUserComunitys(this.actualUser).subscribe(
      (response) => {
        this.comunidades = response;
        if (this.comunidades.length == 0) {
          this.usuarioTieneComunidades = false;
        } else {
          this.usuarioTieneComunidades = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  verComunidad(id: number | undefined) {
    if (id) {
      //this.selectedComunity = comunity;
      this.redirection.navigate(['viewComunity', id]);
      console.log('ID ESCOGIDAAAAAAA:', id);
    } else {
      console.log('NOU');
    }
  }

  getImage(datosFoto: any): string {
    if (datosFoto === null) {
      return this.encabezadoFoto + datosFoto;
    }
    return this.encabezadoFoto + datosFoto;
  }
}
