import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-create-comunity',
  templateUrl: './create-comunity.component.html',
  styleUrls: ['./create-comunity.component.css']
})
export class CreateComunityComponent implements OnInit {

  comunityForm: FormGroup;
  datosCorrectos: boolean;
  token : any;


  constructor(private dataService : DataService,private router:Router) { 
    this.comunityForm=this.createFormGroup();
    this.buscarCursos();
  }

  pruebaRuta(){
    console.log("PRUEBA RUTAA");
    if(!this.dataService.getLoggedIn()){//Si no hay session que redirija
      this.router.navigate(['inicio']);
      return false;
    }
      return true;
    
  }

  ngOnInit(): void {
    //this.buscarCursos();
  }

  buscarCursos(){
    if(this.dataService.getLoggedIn()){
      console.log("SESION INICIADA");
      //Tipo de usuario
      this.token = localStorage.getItem('token');
      this.token = JSON.parse(this.token).token;
      var aux = new User();
      aux.token = this.token;
      console.log(aux.token)
      this.dataService.getCourses(aux).subscribe(
        (user) => {
          console.log(user)
          //alert(user);
        },
        (error) => {
          //alert('ERROR: ' + error);
          console.log(error);
          
        }
      );


    }else{
      console.log("NO HAY SESION");
    }
  }

  createFormGroup(){
    return new FormGroup({
      registroAcademico : new FormControl('',[Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
      password: new FormControl('',[Validators.required]) 
    })
  }

  onResetForm(){
    this.comunityForm.reset();
}

  onSaveForm(){

  }

  //Getter and setter

  get registroAcademico(){
    return this.comunityForm.get('registroAcademico');
  }

  get password(){
    return this.comunityForm.get('password');
  }

}
