// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of } from 'rxjs';
// import { DataService } from 'src/app/data.service';
// import { User } from 'src/app/user.model';

// import { ProfileComponent } from './profile.component';

// describe('ProfileComponent', () => {
//   let component: ProfileComponent;
//   let fixture: ComponentFixture<ProfileComponent>;
//   let dataServiceMock = jasmine.createSpyObj("DataService",["getUserByToken"])

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule],
//       declarations: [ ProfileComponent ],
//       providers: [ ProfileComponent,{
//         provide: DataService,
//         useValue: dataServiceMock
//       }]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     dataServiceMock.getUserByToken.and.returnValue(of(new User()));
//     fixture = TestBed.createComponent(ProfileComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('updateUser',() => {
//     let usr: User = new User();
//     usr.estado = "INACTIVO";
//     dataServiceMock.getUserByToken.and.returnValue(of(usr));
//     spyOn(component,"loadImageProfile").and.stub();
//     component.updateUser();
//     let expResult = false;
//     let result = component.banderaEstadoActivo;
//     expect(expResult).toEqual(result);
//   });

//   it('loadImageProfile',() => {
//     let usr: User = {
//       datosFoto: "photo"
//     }
//     component.usuario = usr;
//     component.loadImageProfile();
//     let expResult = "url(data:image/jpeg;base64," + usr.datosFoto + ")";
//     let result = component.styleBackgroundImage;
//     expect(expResult).toEqual(result);
//   });

// });
