import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { OrdinaryObject } from 'src/app/helpers/ordinary-object.model';
import { Comunity } from 'src/app/models/comunity.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { ValorationPost } from 'src/app/models/valorationPost.model';
import { CommentService } from 'src/app/services/comment/comment.service';
import { CommunityPostService } from 'src/app/services/communityPost/community-post.service';
import { DeletePostService } from 'src/app/services/deletePost/delete-post.service';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { VoteService } from 'src/app/services/vote/vote.service';
import { User } from 'src/app/user.model';

import { InicioComponent } from './inicio.component';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let postService: CommunityPostService;
  let fixture: ComponentFixture<InicioComponent>;
  let dataService: DataService;
  let modal: ModalService;
  let sessionService: SesionService;
  let voteService: VoteService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [InicioComponent],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        HttpClient,
        HeadersService,
        InicioComponent,
        DataService,
        SesionService,
        CommunityPostService,
        VoteService,
        ModalService,
        UploadFileServiceService,
        CommentService,
        NgbModal,
      ],
    });
    // .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioComponent);
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    sessionService = new SesionService(
      TestBed.inject(HttpClient),
      TestBed.inject(DataService)
    );
    
    modal = new ModalService(TestBed.inject(NgbModal));
    postService = new CommunityPostService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    voteService = new VoteService(
      TestBed.inject(HttpClient)
    );
    component = new InicioComponent(
      dataService,
      sessionService,
      modal,
      TestBed.inject(DeletePostService),
      postService,
      voteService,
      TestBed.inject(Router),
      TestBed.inject(CommentService)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onInit', () => {
    let usr: User = {
      registroAcademico: '23532'
    }
    let spy = spyOn(dataService, 'getUserByToken').and.returnValue(of(usr));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  })

  it('getImage', () => {
    let photo = "photo";
    let expResult = component.encabezadoFoto + photo;
    let result = component.getImage(photo);
    expect(result).toEqual(expResult);
  });

  it('loadUserCommunitiesPost', () => {
    let postList: CommunityPost[] = [
      {
        id: 23534
      },
      {
        id: 25453
      }
    ];
    component.user = {
      registroAcademico: '3253',
      token: '235jwdre'
    };
    let spy = spyOn(postService, 'getUserCommunitiesPost').and.returnValue(of(postList));
    component.loadUserCommunitiesPost();
    expect(spy).toHaveBeenCalled();
  });

  it('postIsOfUser', () => {
    let usr: User = {
      registroAcademico: '3244'
    }
    component.user = usr;
    let cmpt: CommunityPost = {
      user: usr
    }
    let expResult = true;
    let resutl = component.postIsOfUser(cmpt);
    expect(resutl).toEqual(expResult);
  });

  it('postIsOfUserFalse', () => {
    let usr: User = {
      registroAcademico: '3244'
    }
    let usr2: User = {
      registroAcademico: '4353'
    }
    component.user = usr2;
    let cmpt: CommunityPost = {
      user: usr
    }
    let expResult = false;
    let resutl = component.postIsOfUser(cmpt);
    expect(resutl).toEqual(expResult);
  });

  it('goToUserProfile', () => {
    let usr: User = {
      registroAcademico: '34543'
    }
    component.goToUserProfile(usr);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['userProfile', usr.registroAcademico]);
  });

  it('goToCommunity', () => {
    let comt: Comunity = {
      id: 23532
    }
    component.goToCommunity(comt);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['viewComunity', comt.id])
  });

  it('getFormatedTime', () => {
    let d = new Date();
    let timeParam = d.toString();
    let expResult = d.getDate() +
      '/' +
      (d.getMonth() + 1) +
      '/' +
      d.getFullYear() +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes();
    let result = component.getFormatedTime(timeParam);
    expect(result).toEqual(expResult);
  });

  it('upvote DOWN', () => {
    let usr: User = {
      registroAcademico: '23523'
    }
    component.user = usr;
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
      valoration: 'DOWN'
    }
    var spy = spyOn(component, 'recalcularRated').and.stub();
    var spy1 = spyOn(
      component,
      'saveOrModifyValorationAndComunityPost'
    ).and.stub();
    let spy2 = spyOn(postService, 'getCommunityPostById').and.returnValue(of(postt));
    component.upvote(postt);
    expect(spy2).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('upvote UP', () => {
    let usr: User = {
      registroAcademico: '23523'
    }
    component.user = usr;
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
      valoration: 'UP'
    }
    var spy = spyOn(component, 'recalcularRated').and.stub();
    var spy1 = spyOn(
      component,
      'saveOrModifyValorationAndComunityPost'
    ).and.stub();
    let spy2 = spyOn(postService, 'getCommunityPostById').and.returnValue(of(postt));
    component.upvote(postt);
    expect(spy2).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('upvote NONE', () => {
    let usr: User = {
      registroAcademico: '23523'
    }
    component.user = usr;
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
      valoration: 'NONE'
    }
    var spy = spyOn(component, 'recalcularRated').and.stub();
    var spy1 = spyOn(
      component,
      'saveOrModifyValorationAndComunityPost'
    ).and.stub();
    let spy2 = spyOn(postService, 'getCommunityPostById').and.returnValue(of(postt));
    component.upvote(postt);
    expect(spy2).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('userName', () => {
    let user: User | undefined = {
      nombreCompleto: 'Jose Perez'
    }

    let expResult = component.userName(user);
    //Assert 1
    if (expResult) {
      expect(user.nombreCompleto).toEqual(expResult);
    }
    //Assert 2
    user = undefined;
    expect(component.userName(user)).toBeNull();
  });

  it('communityName', () => {
    let community: Comunity | undefined = {
      nombre: 'nombre'
    }
    let result = component.communityName(community);

    //Assert 1 
    if(result){
      expect(result).toEqual(community.nombre!);
    }

    //Assert 2
    community = undefined;
    expect(component.communityName(community)).toBeNull();
  });

  it('recalcularRated+',() => {
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
      rated: 1
    }
    let operacion = '+';
    let aumento_decremento = 1;
    component.recalcularRated(postt, operacion, aumento_decremento);
    expect(postt.rated == 2).toBeTruthy();
  });

  it('recalcularRated-',() => {
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
      rated: 1
    }
    let operacion = '-';
    let aumento_decremento = 1;
    component.recalcularRated(postt, operacion, aumento_decremento);
    expect(postt.rated == 0).toBeTruthy();
  });

  it('recalcularRated+WithoutRated',() => {
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
    }
    let operacion = '+';
    let aumento_decremento = 1;
    component.recalcularRated(postt, operacion, aumento_decremento);
    expect(postt.rated == 1).toBeTruthy();
  });

  it('recalcularRated-WithoutRated',() => {
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
    }
    let operacion = '-';
    let aumento_decremento = 1;
    component.recalcularRated(postt, operacion, aumento_decremento);
    expect(postt.rated == -1).toBeTruthy();
  });

  it('downvote DOWN', () => {
    let usr: User = {
      registroAcademico: '2352'
    }
    component.user = usr;
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
      valoration: 'DOWN'
    }
    var spy = spyOn(component, 'recalcularRated').and.stub();
    var spy1 = spyOn(
      component,
      'saveOrModifyValorationAndComunityPost'
    ).and.stub();
    let spy2 = spyOn(postService, 'getCommunityPostById').and.returnValue(of(postt));
    component.downvote(postt);
    expect(spy2).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('down UP', () => {
    let usr: User = {
      registroAcademico: '23523'
    }
    component.user = usr;
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
      valoration: 'UP'
    }
    var spy = spyOn(component, 'recalcularRated').and.stub();
    var spy1 = spyOn(
      component,
      'saveOrModifyValorationAndComunityPost'
    ).and.stub();
    let spy2 = spyOn(postService, 'getCommunityPostById').and.returnValue(of(postt));
    component.downvote(postt);
    expect(spy2).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('down NONE', () => {
    let usr: User = {
      registroAcademico: '23523'
    }
    component.user = usr;
    let postt: CommunityPost = {
      nuevoComentario: 'hola',
      id: 20,
      valoration: 'NONE'
    }
    var spy = spyOn(component, 'recalcularRated').and.stub();
    var spy1 = spyOn(
      component,
      'saveOrModifyValorationAndComunityPost'
    ).and.stub();
    let spy2 = spyOn(postService, 'getCommunityPostById').and.returnValue(of(postt));
    component.downvote(postt);
    expect(spy2).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('saveOrModifyValorationAndComunityPost', () => {
    let usr: User = {
      registroAcademico: '25343',
      token: '435jas'
    }
    let comunityPost: CommunityPost = {
      title: 'title',
      valoration: '2'
    }
    let valoration: ValorationPost = {
      communityPost: comunityPost,
      user: usr,
      valoration: '10'
    }
    let spy = spyOn(sessionService, 'getUserWithToken').and.returnValue(usr);
    let spy2 = spyOn(dataService, 'persistCommunityPost').and.returnValue(of(comunityPost));
    let spy3 = spyOn(voteService, 'genereteValorationPostOfUserLogued').and.returnValue(valoration);
    let spy4 = spyOn(voteService, 'createValoration').and.stub();
    let spy5 = spyOn(voteService, 'updateValoration').and.stub();
    component.user = usr;
    component.saveOrModifyValorationAndComunityPost(comunityPost, true);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    
    component.saveOrModifyValorationAndComunityPost(comunityPost, false);
    expect(spy5).toHaveBeenCalled();
  });



});
