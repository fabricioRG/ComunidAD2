import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private redirection: Router, private route: ActivatedRoute, private dataService: DataService, private sessionService: SesionService) {
  }
  user: User;
  actualUser: User;

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
    this.dataService.getUserByToken(this.sessionService.getUserWithToken()).subscribe(response => {
      this.user = response;
      //Buscando la comunidad para ver si es del usuario
      this.dataService.findUserById(this.actualUser, this.user)
        .subscribe(
          (data) => {
            this.actualUser = data;
          },
          (error) => {
            this.redirection.navigate(['inicio']);
          }
        )
    })
  }

}
