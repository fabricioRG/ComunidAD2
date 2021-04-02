import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';

import { UserProfileComponent } from './user-profile.component';
import dataUser from 'src/app/Test/ArchivosJson/User3.json';
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let dataService: DataService;
  let sesionService: SesionService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [HttpClientTestingModule, RouterTestingModule], //,
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  switch (key) {
                    case 'id':
                      return '2';
                    default:
                      return '2';
                  }
                },
              },
            },
          },
        },

        DataService,
        HeadersService,
        HttpClient,
        SesionService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    sesionService = new SesionService(TestBed.inject(HttpClient), dataService);
    component = new UserProfileComponent(
      TestBed.inject(Router),
      TestBed.inject(ActivatedRoute),
      dataService,
      sesionService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('load userCorrect', () => {
    var spy1 = spyOn(sesionService, 'exitSession').and.returnValue(true);
    var spy2 = spyOn(component, 'getUserInfo').and.stub();
    component.loadUser();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('load userCorrect', () => {
    var spy1 = spyOn(sesionService, 'exitSession').and.returnValue(false);
    component.loadUser();
    expect(spy1).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['inicio']);
  });

  it('getUserInfo', () => {
    var spy1 = spyOn(dataService, 'getUserByToken').and.returnValue(
      of(dataUser)
    );
    var spy2 = spyOn(dataService, 'findUserById').and.returnValue(of(dataUser));

    component.getUserInfo();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.actualUser).toBe(dataUser);
  });
  it('getUserInfo', () => {
    var spy1 = spyOn(dataService, 'getUserByToken').and.returnValue(
      of(dataUser)
    );
    var spy2 = spyOn(dataService, 'findUserById').and.returnValue(
      throwError('a')
    );

    component.getUserInfo();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    //expect(component.actualUser).toBe(dataUser);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['inicio']);
  });
});
