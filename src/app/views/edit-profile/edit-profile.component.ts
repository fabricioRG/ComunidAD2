import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {


  token: any;

  constructor( private dataService: DataService) {
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    const aux = new User();
    aux.token = this.token;
    this.dataService.getUserByToken(aux).subscribe(
      (user) => {
        console.log(user)
        alert(user);
      },
      (error) => {
        alert('ERROR: ' + error.error);
      }
    );
  }

}
