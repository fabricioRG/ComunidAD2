import {FormControl, FormGroup, Validators} from '@angular/forms'
import { Component, OnInit, ElementRef } from '@angular/core';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  credencialesIncorrectas: boolean;

  constructor(private dataService: DataService,private router:Router) { 
    this.loginForm=this.createFormGroup();
  }

  ngOnInit(): void {

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
      this.dataService.postAuthentication(this.loginForm.value).subscribe(result =>{
        console.log(result);
        if(result!=null){
          this.onResetForm();
          this.router.navigate(['inicio']);
        }else{
          console.log("No se encontro el usuario");//Indicar que las credenciales son incorrectas
          this.credencialesIncorrectas=true;
        }
      }
      );
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
