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

  //https://www.youtube.com/watch?v=wid1eH5vUFI

  comunityForm: FormGroup;
  datosCorrectos: boolean;
  token : any;
  courses : any;


  constructor(private dataService : DataService,private router:Router) { 
    this.comunityForm=this.createFormGroup();
    this.token = localStorage.getItem('token');
    this.token = JSON.parse(this.token).token;
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
      var aux = new User();
      aux.token = this.token;
      console.log(aux.token)
      this.dataService.getCourses(aux).subscribe(
        (courses) => {
          console.log(courses)
          this.courses=courses;
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
      nombreDeComunidad : new FormControl('',[Validators.required,Validators.minLength(1),Validators.maxLength(100)]),
      descripcion: new FormControl('',[Validators.required]),
      tipoDeCurso: new FormControl('',[Validators.required]) 
    })
  }

  onResetForm(){
    this.comunityForm.reset();
}

  onSaveForm(){
    console.log("ON SAVE FORM")
          //this.comunityForm.value['tipoDeCurso']="OtraCosaa";

    if(this.comunityForm.valid){
      console.log(this.comunityForm.value);
      //Buscamos el usuario para su ID
      var aux = new User();
      aux.token = this.token;
      console.log(aux.token)
      this.dataService.getUserByToken(aux).subscribe(
      (user) => {
        //Creamos el JSON 
        var messages= JSON.stringify(
          {
            "user":{"registroAcademico":user['registroAcademico']},
            "course":{"codigoDeCurso":this.comunityForm.value['tipoDeCurso']},
            "nombre" : this.comunityForm.value['nombreDeComunidad'],
            "descripcion":this.comunityForm.value['descripcion']
          });
        var comunity=JSON.parse(messages)
        this.dataService.saveComunity(comunity,aux).subscribe(response =>{
          console.log(response)
          alert("Comunidad creada con exito")
          this.onResetForm()
        },(error)=>{
          alert('ERROR: ' + error);
        });
      },
      (error) => {
        alert('ERROR: ' + error);
        
      }
    );
    }
  }

  createJSON(){
    var messages= JSON.stringify(
          {
            "user":{"registroAcademico":111111111},
            "course":{"codigoDeCurso":"119"},
            "nombre" : "Comunidad LOA GRANDEZA",
            "descripcion":"Aldea la Grandeza descripcion de la comunidad"
          });

      console.log("JSONNNNN:"+messages);
      console.log("JSON PARSE"+JSON.parse(messages).user.registroAcademico);

  }


  //Getter and setter

  get nombreDeComunidad(){
    return this.comunityForm.get('nombreDeComunidad');
  }

  get descripcion(){
    return this.comunityForm.get('descripcion');
  }

  get tipoDeCurso(){
    return this.comunityForm.get('tipoDeCurso');
  }


}