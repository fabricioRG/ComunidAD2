import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Comunity } from 'src/app/models/comunity.model';
import { Course } from 'src/app/models/course.model';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';
import { ActiveModalComponent } from '../../components/active-modal/active-modal.component'
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { IdComunityAssign } from 'src/app/models/idComunityAssign.model';

@Component({
  selector: 'app-create-comunity',
  templateUrl: './create-comunity.component.html',
  styleUrls: ['./create-comunity.component.css']
})
export class CreateComunityComponent implements OnInit {

  //https://www.youtube.com/watch?v=wid1eH5vUFI

  comunityForm: FormGroup;
  datosCorrectos: boolean;
  token: any;
  courses: any;

  //Fotos
  fileList: FileList | null;
  comunity: Comunity;
  imagenCargada : string |ArrayBuffer| null;

  constructor(private dataService: DataService, private router: Router, private uploadFileService: UploadFileServiceService,
    private formBuilder: FormBuilder, private _modalService: NgbModal, private sesionService: SesionService,
    private sanitizer : DomSanitizer) {
    this.comunityForm = this.createFormGroup();
    //this.token = localStorage.getItem('token');
    //this.token = JSON.parse(this.token).token;
    this.token = this.sesionService.getToken()
    this.buscarCursos();
    //this.probandoRecuperarImagen()
  }


  ngOnInit(): void {
    //this.buscarCursos();
  }

  buscarCursos(): void {
    if (this.sesionService.exitSession()) {
      console.log("SESION INICIADA EN BUSCAR CURSOS");
      //Tipo de usuario
      var aux = new User();
      aux.token = this.token;
      console.log(aux.token)
      this.dataService.getCourses(aux).subscribe(
        (courses) => {
          console.log(courses)
          this.courses = courses;
          //alert(user);
        },
        (error) => {
          //alert('ERROR: ' + error);
          console.log(error);

        }
      );


    } else {
      console.log("NO HAY SESION");
    }
  }

  createFormGroup() {
    return new FormGroup({
      nombreDeComunidad: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      tipoDeCurso: new FormControl('', [Validators.required]),
      fileImage: new FormControl('')
    })

  }

  onResetForm() {
    this.comunityForm.reset();
  }

  generarComunidad(registroAcademico: any): Comunity {
    //var user: User = new User;
    var course: Course = new Course;
    var comunity: Comunity = new Comunity;
    //comunity.user = user;
    comunity.course = course;
    //user.registroAcademico = registroAcademico;
    course.codigoDeCurso = this.comunityForm.value['tipoDeCurso'];
    comunity.nombre = this.comunityForm.value['nombreDeComunidad'];
    comunity.descripcion = this.comunityForm.value['descripcion'];
    this.comunity = comunity;
    return comunity;
  }

  generarAsignacionDeComunidad(com : Comunity,registroAcademico : any) : ComunityAssign{
    var comunityAssign : ComunityAssign = new ComunityAssign;
    var idCommunityAssign : IdComunityAssign = new IdComunityAssign;
    var user : User = new User;
    var comunidad :Comunity = new Comunity;
    //Id
    idCommunityAssign.idComunidad=com.id;
    idCommunityAssign.registroAcademico=registroAcademico;
    comunityAssign.idComunityAssign=idCommunityAssign;
    //User
    user.registroAcademico=registroAcademico;
    comunityAssign.user=user;
    //Comunity
    comunidad.id=com.id;
    comunityAssign.comunity=comunidad;
    //Tipo
    comunityAssign.tipo="ADMINISTRADOR";

    return comunityAssign;
  }

  llamarModal() {
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = 'Proceso exitoso';
    modal.componentInstance.modalBodyTitle = 'Comunidad guardada';
    modal.componentInstance.modalBody = 'Tu comunidad se ha guardado con exito';
    modal.componentInstance.infoModal = true;

    modal.result.then((result) => {
      console.log("Result: ", result);
    }, (reason) => {
      console.log("Reason: ", reason);
    });

  }

  //Guarda una comunidad en la base de datos(usa la variable global comunity)
  guardarComunidad(aux: User) {
    //Creamos el JSON
    this.dataService.saveComunity(this.comunity, aux).subscribe(response => {
      var com: Comunity= response;
      var comAsig : ComunityAssign = this.generarAsignacionDeComunidad(com,aux.registroAcademico);
      //Guardando la Asignacion de comunidad
      console.log("COMUNIDAD ASIGNACION A GUARDAR:",comAsig)
      this.dataService.saveComunityAssign(comAsig,this.sesionService.getUserWithToken()).subscribe(
        (response)=>{
          console.log("AsigComunidad:",response)
          this.llamarModal()
          this.comunity = response;
          this.onResetForm()
        }
      )
      //this.dataService.
      console.log("ESTO ES EN GUARDAR COMUNIDAD:", response)
    }, (error) => {
      alert('ERROR: ' + error);
    });
  }


  //Accion al hacer click en guardar comunidad(Sevalida si el formulario es valido)
  onSaveForm() {
    console.log("ON SAVE FORM)))))")
    if (this.comunityForm.valid) {
      console.log(this.comunityForm.value);
      //Buscamos el usuario para su ID
      this.dataService.getUserByToken(this.sesionService.getUserWithToken()).subscribe(
        (user) => {
          this.generarComunidad(user.registroAcademico)
          user.token=this.token;
          if (this.fileList) {//Si selecciono una imagen
            this.guardarImagenYComunidad(user)
          } else {
            this.guardarComunidad(user)
          }
        },
        (error) => {
          alert('ERROR: ' + error);
        }
      );
    }
  }

  //Evento el cual es lanzado al buscar una imagen en el input fyle
  cargarImagen(e: Event ) {
    
    const element = e.currentTarget as HTMLInputElement;
    this.fileList = element.files;
    if(this.fileList){
      const target = e.target as HTMLInputElement;
      const file: File=(target.files as FileList)[0]
      const reader = new FileReader()
      reader.onload = e => this.imagenCargada=reader.result;
      reader.readAsDataURL(file)
    }
  }

  //Sube la imagen(regresa una comunidad con el path de la foto), y guarda la comunidad ya con la foto
  guardarImagenYComunidad(user : User) {
    const data = new FormData()
    if (this.fileList) {
      data.append('file', this.fileList[0])
      var selectedFile: File | null = this.fileList.item(0);
      this.uploadFileService.upload(data, user).subscribe(response => {
        console.log("RESPUESTA GUARDAR IMAGEN EN SPRING:" + response)
        var com: Comunity = response;
        this.comunity.foto = com.foto;
        console.log("Communidad que se creo:", this.comunity)
        this.imagenCargada=null
        this.guardarComunidad(user)
      })
    }

  }



  //Getter and setter

  get nombreDeComunidad() {
    return this.comunityForm.get('nombreDeComunidad');
  }

  get descripcion() {
    return this.comunityForm.get('descripcion');
  }

  get tipoDeCurso() {
    return this.comunityForm.get('tipoDeCurso');
  }

  get fileImage() {
    return this.comunityForm.get('fileImage');
  }


  public setDataService(dataSer: DataService) {
    this.dataService = dataSer;
  }

  get f() {
    return this.comunityForm.controls;
  }



  //Roles
  verificarSesion(): boolean {
    if (!this.sesionService.exitSession() || !this.sesionService.usuarioEsAdministradorDeComunidad()) {//Si no hay session que redirija
      this.router.navigate(['inicio']);
      return false;
    }
    return true;
  }


  
}
