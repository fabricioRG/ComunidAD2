import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateUserAdminComponent } from './state-user-admin.component';

describe('StateUserAdminComponent', () => {
  let component: StateUserAdminComponent;
  let fixture: ComponentFixture<StateUserAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateUserAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
