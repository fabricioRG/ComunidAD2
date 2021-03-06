import {FormControl, FormGroup, Validators} from '@angular/forms'
import { Component, OnInit, ElementRef } from '@angular/core';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  credencialesIncorrectas: boolean;
  token$: Observable<boolean>;
  token : any;

  constructor(private dataService: DataService,private router:Router) { 
    this.loginForm=this.createFormGroup();
    
  }

  ngOnInit(): void {
    this.token$=this.dataService.isLoggedIn();
    this.token$.subscribe(isSuscribe=>{
    console.log("Sucribe IN LOGIN:"+isSuscribe);
    console.log("LocalStorage IN LOGIN:"+localStorage.getItem('token'));
    if(isSuscribe){
      this.router.navigate(['inicio']);
      //this.findUser();
    }else{
      this.credencialesIncorrectas=true;
    }
  })
  }

  //Buscar usuario
  findUser(){
    this.token = localStorage.getItem('token');
    this.token = JSON.parse(this.token).token
    var aux = new User();
    aux.token = this.token;
    console.log("Token a mandar:"+aux.token);
    this.dataService.getUserByToken(aux).subscribe(
      (user) => {
        console.log(user)
        alert(user);
      },
      (error) => {
        alert('ERROR: ' + error);
        console.log(error);
        
      }
    );
  }

  //Validaciones de formulario
  createFormGroup(){
    return new FormGroup({
      registroAcademico : new FormControl('',[Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
      password: new FormControl('',[Validators.required]) 
    })
  }

  //Limpiar el formulario
  onResetForm(){
      this.loginForm.reset();
  }

  //Guardar los valores del formulario
  onSaveForm(){
    if(this.loginForm.valid){
      //this.loginForm.value['password']="OtraCosaa";
      console.log(this.loginForm.value)
      this.dataService.logIn(this.loginForm.value);
      //Ya revisa el observable
    }else{
      console.log("No se envio la informacion");
    }
  }

  get registroAcademico(){
    return this.loginForm.get('registroAcademico');
  }

  get password(){
    return this.loginForm.get('password');
  }

  

}
